import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { Types } from "mongoose";
import { User } from "src/DB";
import { CompanyRepository } from "src/DB/model/compeny/compeny.repository";
import { JobOpportunityRepository } from "src/DB/model/job_opportunity/JobOpportunity.repository";
import { JobOpportunity } from "src/DB/model/job_opportunity/JobOpportunity.schema";
import { Company } from "../compeny/entities";
import { CreateJobDto, UpdateJobDto } from "./DTO";
import { JobFactoryServide } from "./factory";
import { ApplicationRepository } from "src/DB/model/application/Application.repository";
import { JobGateway } from "./job.socket.io";

@Injectable()
export class JobService {
    constructor(
        private readonly jobFactory: JobFactoryServide,
        private readonly jobRepository: JobOpportunityRepository,
        private readonly companyRepository: CompanyRepository,
        private readonly applicationRepository: ApplicationRepository,
        private readonly socketGateway: JobGateway,
    ) { }

    private isHRForCompany(user: User, company: Company): boolean {
        return user._id.equals(company.createdBy) || company.HRs.some((hr) => hr.equals(user._id));
    }
    private isHRForJob(job: JobOpportunity, user: User) {
        if (!((new Types.ObjectId(user._id).equals(job.addedBy))
            || this.isHRForCompany(user, job.companyId as unknown as Company))) {
            throw new UnauthorizedException('you not allowed ❌❌❌');
        }
    }
    //create job
    public async createJob(createJobDto: CreateJobDto, companyId: string | Types.ObjectId, user: User) {
        // this.jobRepository
        //check is compant exsit and give info by hr
        const company = await this.companyRepository.getOne({ _id: companyId, deletedAt: { $exists: false } });
        if (!company) {
            throw new BadRequestException('company not found');
        }
        const isHR = this.isHRForCompany(user, company);
        if (!isHR) {
            throw new ForbiddenException('you not allowed to create job');
        }
        //factory
        const job = this.jobFactory.CreateJob(createJobDto, companyId, user);
        //saving in db
        const savedJob = await this.jobRepository.create(job);
        return savedJob;

    }
    //update job
    public async updateJob(id: string | Types.ObjectId, update: UpdateJobDto, user: User) {
        //get data -infoUpdate - who hr want update -check isClosed
        const jobExist = await this.jobRepository.getOne({ _id: id, closed: false, deletedAt: { $exists: false } }, {}, { populate: [{ path: 'companyId' }] });
        if (!jobExist) {
            throw new BadRequestException('job not found');
        }
        this.isHRForJob(jobExist, user);
        //updated go factory
        const factoryJob = this.jobFactory.updateJob(update, jobExist, user);
        factoryJob.companyId = jobExist.companyId._id;
        const updatedJob = await this.jobRepository.updateOne({ _id: id }, factoryJob);

        if (!updatedJob) {
            throw new ConflictException('can\'t update job now');
        }
        const { companyId, closed, ...result } = updatedJob.toObject();
        return result;
    }
    //delete 
    public async deleteJob(id: string | Types.ObjectId, user: User) {
        //get id , user
        const jobExist = await this.jobRepository.getOne({ _id: id, closed: false, deletedAt: { $exists: false } }, {}, { populate: [{ path: 'companyId' }] });
        if (!jobExist) {
            throw new BadRequestException('job not found');
        }
        this.isHRForJob(jobExist, user);
        //delete
        const deletedJob = await this.jobRepository.softDeleteOne(id, {
            deletedAt: Date.now()
        });
        if (!deletedJob) {
            throw new ConflictException('can\'t delete job now');
        }
        const { companyId, closed, ...result } = deletedJob.toObject();
        return result;
    }
    //Get all Jobs or a specific one for a specific company. 
    //public user get info job
    public async GetSpecificAllJobs(companyId: string | Types.ObjectId, skip: number = 0, limit: number = 10, sort: string = '-createdAt') {

        const compId = new Types.ObjectId(companyId);
        const data = await this.jobRepository.getAll(
            { companyId: compId },
            // { companyId: companyId },
            {},
            { skip, limit, sort, populate: [{ path: 'companyId', select: "-bannedAt -legalAttachment -approvedByAdmin" }] }
        );
        console.log(data);
        return data;
    }
    //get allow for user search
    //public for all user
    public async searchJobs(query: any, skip: number = 0, limit: number = 10, sort: string = '-createdAt') {
        // query
        let filters: any = {};
        if (query.jobTitle)
            filters.jobTitle = { $regex: query.jobTitle, $options: 'i' };
        if (query.workingTime) filters.workingTime = query.workingTime;
        if (query.jobLocation) filters.jobLocation = query.jobLocation;
        if (query.seniorityLevel) filters.seniorityLevel = query.seniorityLevel;
        if (query.softSkills) {
            filters.softSkills = {
                $in: query.softSkills.map((s) => s.trim()),
            };
        }


        const data = await this.jobRepository.getAll(filters,
            {},
            { skip, limit, sort, populate: [{ path: 'companyId', select: "-bannedAt -legalAttachment -approvedByAdmin" }] }
        )
        return data;
    }
    //todo handel
    //idJob
    public async getApplier(id: string | Types.ObjectId, user: User) {
        const jobExist = await this.jobRepository.getOne({ _id: id, closed: false, deletedAt: { $exists: false } }, {}, {
            populate: [{ path: 'companyId' }]
        });
        if (!jobExist) {
            throw new BadRequestException('job not found');
        }
        const company = await this.companyRepository.getOne({ _id: jobExist.companyId._id });
        if (!company) {
            throw new BadRequestException('company not found');

        }
        this.isHRForJob(jobExist, user);

        //get all apply
        //todo when apply test it
        await this.jobRepository.getAll(
            {},
            {},
            { populate: [{ path: 'Application' }] }
        )
    }


    //apply job
    public async applyJob(id: string | Types.ObjectId, user: User) {
        //check job exist and not closed
        const jobExisted = await this.jobRepository.getOne({ _id: id, deletedAt: { $exists: false } });
        if (!jobExisted) {
            throw new NotFoundException('job not found');
        }
        if (jobExisted.closed) {
            throw new NotFoundException("Job not available");
        }
        const alreadyApplied = await this.applicationRepository.getOne({ jobId: jobExisted._id, userId: user._id });
        if (alreadyApplied) throw new BadRequestException("You already applied to this job");
        const applyJob = await this.applicationRepository.create({ jobId: jobExisted._id, userId: user._id },);

        // Emit socket event to HRs
        this.socketGateway.notifyHR(
            jobExisted.companyId.toString(),
            {
                message: "New application received",
                jobId: jobExisted._id, userId: user._id
            });
        return applyJob;
    }

}
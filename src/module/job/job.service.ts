import { BadRequestException, ConflictException, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { Types } from "mongoose";
import { User } from "src/DB";
import { CompanyRepository } from "src/DB/model/compeny/compeny.repository";
import { JobOpportunityRepository } from "src/DB/model/job_opportunity/JobOpportunity.repository";
import { CreateJobDto, UpdateJobDto } from "./DTO";
import { JobFactoryServide } from "./factory";
import { Company } from "../compeny/entities";
import { JobOpportunity } from "src/DB/model/job_opportunity/JobOpportunity.schema";

@Injectable()
export class JobService {
    constructor(
        private readonly jobFactory: JobFactoryServide,
        private readonly jobRepository: JobOpportunityRepository,
        private readonly companyRepository: CompanyRepository
    ) { }

    private isHRForCompany(user: User, company: Company): boolean {
        return user._id.equals(company.createdBy) || company.HRs.some((hr) => hr.equals(user._id));
    }
    private isHRForJob(job: JobOpportunity, user: User) {
        if (!((new Types.ObjectId(user._id).equals(job.addedBy))
            || this.isHRForCompany(user, job.companyId as unknown as Company))) {
            throw new UnauthorizedException('you not allowed to update job');
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
}
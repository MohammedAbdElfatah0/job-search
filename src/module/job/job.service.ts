import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { Types } from "mongoose";
import { ApplicationStatus, CloudinaryService, jobAcceptedTemplate, jobRejectedTemplate, sendEmailHelper } from "../../common";
import { ApplicationRepository, CompanyRepository, JobOpportunity, JobOpportunityRepository, User } from "../../DB";
import { Company } from "../compeny/entities";
import { UserService } from "../user/user.service";
import { ChangeStausDto, CreateJobDto, UpdateJobDto } from "./dto";
import { JobFactoryServide } from "./factory";
import { JobGateway } from "./job.socket.io";

@Injectable()
export class JobService {
    constructor(
        private readonly jobFactory: JobFactoryServide,
        private readonly jobRepository: JobOpportunityRepository,
        private readonly companyRepository: CompanyRepository,
        private readonly applicationRepository: ApplicationRepository,
        private readonly socketGateway: JobGateway,
        private readonly userService: UserService,
        private readonly cloudinaryService: CloudinaryService,
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
        const oneWeekInMs = 7 * 24 * 60 * 60 * 1000;
        const deletedJob = await this.jobRepository.softDeleteOne(id, {
            deletedAt: Date.now() + oneWeekInMs
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
        const companyExist = await this.companyRepository.getOne({ _id: compId, deletedAt: { $exists: false } });
        if (!companyExist) {
            throw new NotFoundException('company not found');
        }
        const data = await this.jobRepository.getAll(
            // { companyId: compId },
            { companyId: companyId },
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


    //applier get all applier for job
    public async getApplier(id: string | Types.ObjectId, user: User) {
        const jobExist = await this.jobRepository.getOne(
            { _id: id, closed: false, deletedAt: { $exists: false } },
            {},
            { populate: [{ path: 'companyId' }] }
        );
        if (!jobExist) {
            throw new BadRequestException('job not found');
        }

        const company = await this.companyRepository.getOne({ _id: jobExist.companyId._id });
        if (!company) {
            throw new BadRequestException('company not found');
        }

        this.isHRForJob(jobExist, user);

        // ✅ get all applications for this job
        const applications = await this.applicationRepository.getAll(
            { jobId: jobExist._id },
            {},
            {
                // optional: populate user info for each applier
                populate: [{ path: 'userId', select: 'firstName lastName email mobileNumber' }],
            },
        );

        return applications;
    }


    //apply job
    public async applyJob(id: string | Types.ObjectId, user: User, CV: Express.Multer.File) {
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


        const userCvs = await this.cloudinaryService.uploadFile(
            CV,
            `JobSearch/${user._id}/company/${jobExisted.jobTitle}/apply/`,
        )
        const applyJob = await this.applicationRepository.create({
            jobId: jobExisted._id, userId: user._id, userCV: {
                public_id: userCvs.display_name,
                secure_url: userCvs.secure_url
            }
        },);

        // Emit socket event to HRs
        this.socketGateway.notifyHR(
            jobExisted.companyId.toString(),
            {
                message: "New application received",
                jobId: jobExisted._id, userId: user._id
            });
        return applyJob;
    }

    public async accpAndRejectJob(id: string, changeStatusDto: ChangeStausDto, user: User) {
        //id of application applier
        const applicationApply = await this.applicationRepository.getOne({ _id: id });
        if (!applicationApply) throw new NotFoundException('application not found');
        //get exist?
        const job = await this.jobRepository.getOne({ _id: applicationApply.jobId }, {}, { populate: [{ path: 'companyId' }] });
        if (!job) {
            throw new NotFoundException('job not found');
        }
        // check hr using existing helper
        this.isHRForJob(job, user);

        //found user

        const userApply = await this.userService.getProfileUser(applicationApply.userId);
        //chage state
        switch (changeStatusDto.status) {
            case ApplicationStatus.ACCEPTED:
                //send mail to him\her   
                await sendEmailHelper({
                    to: userApply.email,
                    subject: 'Application Accepted',
                    html: jobAcceptedTemplate(userApply.firstName + ' ' + userApply.lastName, job.jobTitle, changeStatusDto.reason),
                });
                break;
            case ApplicationStatus.REJECTED:
                //send mail to him\her
                await sendEmailHelper({
                    to: userApply.email,
                    subject: 'Application Rejected',
                    html: jobRejectedTemplate(userApply.firstName + ' ' + userApply.lastName, job.jobTitle, changeStatusDto.reason),
                });
                break;
            default:
                throw new BadRequestException('Invalid status');
        }
        applicationApply.status = changeStatusDto.status;
        applicationApply.reason = changeStatusDto.reason;
        applicationApply.deleteAt = new Date(Date.now() + (7 * 24 * 60 * 60 * 1000));
        await applicationApply.save();
        return applicationApply;

    }
}
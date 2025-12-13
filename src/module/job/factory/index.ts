import { Injectable } from "@nestjs/common";
import { Types } from "mongoose";
import { User } from "../../../DB";
import { CreateJobDto, UpdateJobDto } from "../DTO";
import { Job } from "../entity";

@Injectable()
export class JobFactoryServide {
    public CreateJob(jobCreateDto: CreateJobDto, companyId: string | Types.ObjectId, user: User) {
        const job = new Job();
        job.jobTitle = jobCreateDto.jobTitle;
        job.jobDescription = jobCreateDto.jobDescription;
        job.jobLocation = jobCreateDto.jobLocation;
        job.seniorityLevel = jobCreateDto.seniorityLevel;
        job.technicalSkills = jobCreateDto.technicalSkills;
        job.softSkills = jobCreateDto.softSkills;
        job.workingTime = jobCreateDto.workingTime;
        job.companyId = typeof companyId === "string" ? new Types.ObjectId(companyId) : companyId;
        job.addedBy = user._id;
        job.updatedBy = user._id;
        return job;
    }
    public updateJob(updateJobDto: UpdateJobDto, oldJob: Job, user: User) {
        const job = new Job();
        job.jobTitle = updateJobDto.jobTitle;
        job.jobDescription = updateJobDto.jobDescription;
        job.jobLocation = updateJobDto.jobLocation;
        job.seniorityLevel = updateJobDto.seniorityLevel;
        job.workingTime = updateJobDto.workingTime;
        job.technicalSkills = updateJobDto.technicalSkills;
        job.softSkills = updateJobDto.softSkills;
        job.companyId = oldJob.companyId;
        job.addedBy = oldJob.addedBy;
        job.updatedBy = user._id;
        return job;
    }
}
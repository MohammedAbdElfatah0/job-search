import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { CreateJobDto } from "./DTO/create-job.dto";
import { AuthGuard, Public, User } from "src/common";
import { JobService } from "./job.service";
import { UpdateJobDto } from "./DTO";

@Controller('job')
@UseGuards(AuthGuard)
export class JobController {
    constructor(
        private readonly jobService: JobService,
    ) { }

    @Post(":companyId")
    async createJob(@Body() createJobDto: CreateJobDto, @Param('companyId') companyId, @User() user: any) {
        const data = await this.jobService.createJob(createJobDto, companyId, user);
        return {
            message: 'job created successfully',
            data
        }
    }
    @Put(':id')
    async updateJob(@Body() updateJobDto: UpdateJobDto, @Param('id') id: string, @User() user: any) {
        const data = await this.jobService.updateJob(id, updateJobDto, user);
        return {
            message: 'job created successfully',
            data
        }
    }
    @Delete(':id')
    async deleteJob(@Param('id') id: string, @User() user: any) {
        const data = await this.jobService.deleteJob(id, user);
        return {
            message: 'job deleted successfully',
            data
        }
    }
    @Get('company/:companyId')
    @Public()
    async getJobsForCompany(
        @Param('companyId') companyId: string,
        @Query('skip') skip?: number,
        @Query('limit') limit?: number,
        @Query('sort') sort: string = '-createdAt',
    ) {
        const data = await this.jobService.GetSpecificAllJobs(
            companyId,
            Number(skip),
            Number(limit),
            sort,
        );
        return {
            message: 'Jobs fetched successfully',
            data,
        };
    }
    @Get('company')
    @Public()
    async searchJobs(
        @Query('workingTime') workingTime?: string,
        @Query('jobLocation') jobLocation?: string,
        @Query('seniorityLevel') seniorityLevel?: string,
        @Query('jobTitle') jobTitle?: string,
        @Query('skills') skills?: string, // comma separated
        @Query('skip') skip?: number,
        @Query('limit') limit?: number,
        @Query('sort') sort: string = '-createdAt',
    ) {
        const data = await this.jobService.searchJobs(
            {
                workingTime,
                jobLocation,
                seniorityLevel,
                jobTitle,
                skills,
            },
            Number(skip),
            Number(limit),
            sort,
        );
        return {
            message: 'Jobs fetched successfully',
            data,
        };
    }
}
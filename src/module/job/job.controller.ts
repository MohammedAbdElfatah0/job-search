import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { AuthGuard, Public, User } from "../../common";
import { ChangeStausDto, CreateJobDto, UpdateJobDto } from "./DTO";
import { JobService } from "./job.service";

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
    @Get('applyJob/:id')
    public async getApplier(@Param('id') id: string, @User() user: any) {
        const data = await this.jobService.getApplier(id, user);
        return {
            message: "all job applier",
            data
        }
    }
    @Post('apply/:id')
    @UseInterceptors(FileInterceptor('CV'))
    async applyJob(
        @Param('id') id: string,
        @User() user,
        @UploadedFile() CV: Express.Multer.File
    ) {
        const data = await this.jobService.applyJob(id, user, CV);
        return {
            message: 'Job applied successfully',
            success: true,
            data,
        };
    }
    @Patch('application/status/:id')
    async changeStatus(
        @Param('id') id: string,
        @Body() changeStatusDto: ChangeStausDto,
        @User() user,
    ) {
        const data = await this.jobService.accpAndRejectJob(id, changeStatusDto, user);
        return {
            message: 'Application status updated',
            success: true,
            data,
        };
    }

}
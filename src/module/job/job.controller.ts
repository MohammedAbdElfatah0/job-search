import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { AuthGuard, Public, User } from "../../common";
import { ChangeStausDto, CreateJobDto, ParamIdDto, UpdateJobDto } from "./dto";
import { JobService } from "./job.service";

@Controller('job')
@UseGuards(AuthGuard)
export class JobController {
    constructor(
        private readonly jobService: JobService,
    ) { }

    @Post(":id")//id of company
    //check name id 
    async createJob(@Body() createJobDto: CreateJobDto, @Param() paramIdDto: ParamIdDto, @User() user: any) {
        const data = await this.jobService.createJob(createJobDto, paramIdDto.id, user);
        return {
            message: 'job created successfully',
            data
        }
    }
    @Put(':id')
    async updateJob(@Body() updateJobDto: UpdateJobDto, @Param() paramIdDto: ParamIdDto, @User() user: any) {
        const data = await this.jobService.updateJob(paramIdDto.id, updateJobDto, user);
        return {
            message: 'job created successfully',
            data
        }
    }
    @Delete(':id')
    async deleteJob(@Param() paramIdDto: ParamIdDto, @User() user: any) {
        const data = await this.jobService.deleteJob(paramIdDto.id, user);
        return {
            message: 'job deleted successfully',
            data
        }
    }
    @Get(':id/company')//id of company
    @Public()
    async getJobsForCompany(
        @Param() paramIdDto: ParamIdDto,
        @Query('skip') skip?: number,
        @Query('limit') limit?: number,
        @Query('sort') sort: string = '-createdAt',
    ) {
        const data = await this.jobService.GetSpecificAllJobs(
            paramIdDto.id, //  companyId,
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
    public async getApplier(@Param() paramIdDto: ParamIdDto, @User() user: any) {
        const data = await this.jobService.getApplier(paramIdDto.id, user);
        return {
            message: "all job applier",
            data
        }
    }
    @Post('apply/:id')
    @UseInterceptors(FileInterceptor('CV'))
    async applyJob(
        @Param() paramIdDto: ParamIdDto,
        @User() user,
        @UploadedFile() CV: Express.Multer.File
    ) {
        const data = await this.jobService.applyJob(paramIdDto.id, user, CV);
        return {
            message: 'Job applied successfully',
            success: true,
            data,
        };
    }
    @Patch('application/status/:id')
    async changeStatus(
        @Param() paramIdDto: ParamIdDto,
        @Body() changeStatusDto: ChangeStausDto,
        @User() user,
    ) {
        const data = await this.jobService.accpAndRejectJob(paramIdDto.id, changeStatusDto, user);
        return {
            message: 'Application status updated',
            success: true,
            data,
        };
    }

}
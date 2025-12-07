import { Body, Controller, Delete, Param, Post, Put, UseGuards } from "@nestjs/common";
import { CreateJobDto } from "./DTO/create-job.dto";
import { AuthGuard, User } from "src/common";
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
}
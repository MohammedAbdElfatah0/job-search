import { Module } from "@nestjs/common";
import { JobService } from "./job.service";
import { JobFactoryServide } from "./factory";
import { JobController } from "./job.controller";

@Module({
    imports: [],
    controllers: [JobController],
    providers: [JobService, JobFactoryServide],
})
export class JobModule { }
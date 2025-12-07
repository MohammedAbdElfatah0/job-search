import { Module } from "@nestjs/common";
import { JobService } from "./job.service";
import { JobFactoryServide } from "./factory";
import { JobController } from "./job.controller";
import { CompanyRepository } from "src/DB/model/compeny/compeny.repository";
import { JobOpportunityRepository } from "src/DB/model/job_opportunity/JobOpportunity.repository";
import { JobOpportunityModel } from "src/DB/model/job_opportunity/JobOpportunity.schema";
import { MongooseModule } from "@nestjs/mongoose";
import { Compeny, CompenySchema } from "src/DB/model/compeny/compeny.schema";
import { ApplicationRepository } from "src/DB/model/application/Application.repository";
import { Application, ApplicationSchema } from "src/DB/model/application/Application.schema";
import { JobGateway } from "./job.socket.io";

@Module({
    imports: [
        JobOpportunityModel,
        MongooseModule.forFeature(
            [{ name: Compeny.name, schema: CompenySchema }]
        ),
        MongooseModule.forFeature(
            [{ name: Application.name, schema: ApplicationSchema }]
        ),
    ],
    controllers: [JobController],
    providers: [JobService, JobFactoryServide, JobOpportunityRepository, CompanyRepository, ApplicationRepository, JobGateway],
})
export class JobModule { }
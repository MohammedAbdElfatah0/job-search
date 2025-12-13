import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { CloudinaryService } from "../../common";
import { Application, ApplicationRepository, ApplicationSchema, CompanyRepository, Compeny, CompenySchema, JobOpportunityModel, JobOpportunityRepository } from "../../DB";
import { UserService } from "../user/user.service";
import { JobFactoryServide } from "./factory";
import { JobController } from "./job.controller";
import { JobService } from "./job.service";
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
    providers: [JobService, JobFactoryServide, JobOpportunityRepository, CompanyRepository, ApplicationRepository, JobGateway, UserService, CloudinaryService],
})
export class JobModule { }
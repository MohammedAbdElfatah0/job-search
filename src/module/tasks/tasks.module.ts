// tasks.module.ts
import { Module } from "@nestjs/common";
import { TasksService } from "./tasks.service";
import {
    UserRepository,
    CompanyRepository,
    JobOpportunityRepository,
    ApplicationRepository,
    userMongooseModule,
    Compeny,
    CompenySchema,
    JobOpportunityModel,
    Application,
    ApplicationSchema,
} from "src/DB";
import { MongooseModule } from "@nestjs/mongoose";

@Module({
    imports: [
        userMongooseModule,
        JobOpportunityModel,
        MongooseModule.forFeature(
            [
                { name: Compeny.name, schema: CompenySchema },
                { name: Application.name, schema: ApplicationSchema }
            ]
        ),
    ],
    providers: [
        TasksService,
        UserRepository,
        CompanyRepository,
        JobOpportunityRepository,
        ApplicationRepository,
    ],
})
export class TasksModule { }

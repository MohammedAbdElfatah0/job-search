import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { CompanyRepository, Compeny, CompenySchema } from "../../DB";
import { CloudinaryService } from "../../common";
import { CompanyController } from "./company.controller";
import { CompanyService } from "./company.service";
import { CompanyFactoryService } from "./factory";

@Module(
    {
        imports: [
            MongooseModule.forFeature(
                [{ name: Compeny.name, schema: CompenySchema }]
            )
        ],
        controllers: [
            CompanyController
        ],
        providers: [
            CompanyService,
            CompanyFactoryService,
            CompanyRepository,
            CloudinaryService,
        ],
        exports: [
            CompanyService,
            CompanyFactoryService,
            CompanyRepository,
            CloudinaryService,]
    }
)
export class CompanyModule { }
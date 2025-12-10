import { Module } from "@nestjs/common";
import { CompanyService } from "./company.service";
import { CompanyFactoryService } from "./factory";
import { CompanyRepository } from "src/DB/model/compeny/compeny.repository";
import { CompanyController } from "./company.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Compeny, CompenySchema } from "src/DB/model/compeny/compeny.schema";
import { CloudinaryService } from "src/common";

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
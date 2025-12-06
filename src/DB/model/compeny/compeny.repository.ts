import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { AbstractRepository } from "../../repository";
import { Compeny, CompenyDocument } from "./compeny.schema";
@Injectable()
export class CompanyRepository extends AbstractRepository<CompenyDocument> {
    constructor(@InjectModel(Compeny.name) private readonly compenyModel: Model<CompenyDocument>) {
        super(compenyModel);
    }
}
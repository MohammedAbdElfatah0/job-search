import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Application, ApplicationDocument } from "./Application.schema";
import { AbstractRepository } from "../../repository";
@Injectable()
export class ApplicationRepository extends AbstractRepository<ApplicationDocument> {
    constructor(
        @InjectModel(Application.name) private readonly applicationModel: Model<ApplicationDocument>,
    ) {
        super(applicationModel);
    }


}

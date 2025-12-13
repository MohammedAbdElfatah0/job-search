import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { JobOpportunity } from "./JobOpportunity.schema";
import { AbstractRepository } from "../../repository";
@Injectable()
export class JobOpportunityRepository extends AbstractRepository<JobOpportunity> {
    constructor(
        @InjectModel(JobOpportunity.name) private readonly jobOpportunityModel: Model<JobOpportunity>,
    ) {
        super(jobOpportunityModel);
    }


}

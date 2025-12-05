import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { AbstractRepository } from "../../repository";
import { User, UserDocument } from "./user.schema";
@Injectable()
export class UserRepository extends AbstractRepository<UserDocument> {
    constructor(@InjectModel("User") private readonly userModel: Model<UserDocument>) {
        super(userModel);
    }
}
import { Injectable } from "@nestjs/common";
import { User } from "src/DB";
import { UpdateProfileDto } from "./DTO";




@Injectable()
export class UserService {
    constructor() { }


    //update profile 
    public async updateProfile(updateProfileDTo: UpdateProfileDto, user: User) {
        //get data from update profile || user from token
        //modified user
        //save user 
        //return response
    }

}
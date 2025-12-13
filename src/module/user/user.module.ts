import { Module } from "@nestjs/common";
import { CloudinaryService } from "../../common";
import { userMongooseModule, UserRepository } from "../../DB";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";

@Module(
    {
        imports: [userMongooseModule],
        providers: [UserService, UserRepository, CloudinaryService],
        controllers: [UserController],
        exports: [UserService, UserRepository, CloudinaryService]
    }
)
export class UserModule { }
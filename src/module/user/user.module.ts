import { Module } from "@nestjs/common";
import { userMongooseModule, UserRepository } from "src/DB";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { CloudinaryService } from "src/common";

@Module(
    {
        imports:[userMongooseModule],
        providers: [UserService,UserRepository,CloudinaryService],
        controllers: [UserController]

    }
)
export class UserModule { }
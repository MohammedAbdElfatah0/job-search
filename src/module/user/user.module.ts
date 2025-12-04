import { Module } from "@nestjs/common";
import { userMongooseModule, UserRepository } from "src/DB";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";

@Module(
    {
        imports:[userMongooseModule],
        providers: [UserService,UserRepository],
        controllers: [UserController]

    }
)
export class UserModule { }
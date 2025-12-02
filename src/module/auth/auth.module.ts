import { Module } from "@nestjs/common";
import { UserModule, UserRepository } from "src/DB";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { AuthFactory } from "./factory";

@Module({
    imports:[UserModule],
    controllers: [AuthController],
    providers: [AuthService,AuthFactory,UserRepository],
})
export class AuthModule { }
import { Module } from "@nestjs/common";
import { userMongooseModule, UserRepository } from "src/DB";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { AuthFactory } from "./factory";

@Module({
    imports: [userMongooseModule,],
    controllers: [AuthController],
    providers: [AuthService, AuthFactory, UserRepository ],
})
export class AuthModule { }
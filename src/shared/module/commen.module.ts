import { Global, Module } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { userMongooseModule, UserRepository } from "../../DB";
import { TokenModule } from "../../module/token/token.module";
import { AuthGuard, RolesGuards } from "../../common";

@Global()
@Module({
    imports: [TokenModule,userMongooseModule ],
    providers: [JwtService, UserRepository, AuthGuard, RolesGuards],
    exports: [JwtService, TokenModule, UserRepository, AuthGuard, RolesGuards],
})
export class CommenModule {

}
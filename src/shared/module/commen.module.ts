import { Global, Module } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { userMongooseModule, UserRepository } from "src/DB";
import { TokenModule } from "src/module/token/token.module";
import { AuthGuard, RolesGuards } from "src/common/guard";

@Global()
@Module({
    imports: [TokenModule,userMongooseModule ],
    providers: [JwtService, UserRepository, AuthGuard, RolesGuards],
    exports: [JwtService, TokenModule, UserRepository, AuthGuard, RolesGuards],
})
export class CommenModule {

}
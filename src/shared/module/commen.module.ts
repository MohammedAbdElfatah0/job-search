
import { tokenModel, TokenRepository } from "src/DB";
import { Global, Module } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { TokenService } from "src/module/token";

@Global()
@Module({
    imports: [tokenModel],
    providers: [JwtService, TokenService, TokenRepository],
    exports: [JwtService, TokenService, TokenRepository],
})
export class CommenModule {

}
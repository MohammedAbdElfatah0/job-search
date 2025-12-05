import { Global, Module } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { TokenModule } from "src/module/token/token.module";

@Global()
@Module({
    imports: [TokenModule],
    providers: [JwtService],
    exports: [JwtService, TokenModule],
})
export class CommenModule {

}
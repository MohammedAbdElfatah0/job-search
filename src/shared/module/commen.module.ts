import { Global, Module } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { userMongooseModule, UserRepository } from "src/DB";
import { TokenModule } from "src/module/token/token.module";

@Global()
@Module({
    imports: [TokenModule,userMongooseModule ],
    providers: [JwtService, UserRepository],
    exports: [JwtService, TokenModule, UserRepository],
})
export class CommenModule {

}
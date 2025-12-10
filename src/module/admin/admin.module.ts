import { Module } from "@nestjs/common";
import { CompanyModule } from "../compeny/company.module";
import { AdminReslove } from "./admin.reslove";
import { UserModule } from "../user/user.module";

@Module({
    imports: [CompanyModule, UserModule],
    providers: [AdminReslove,],

})
export class AdminModule {
}
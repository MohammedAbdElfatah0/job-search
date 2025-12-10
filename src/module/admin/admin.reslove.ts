import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { AdminGQL } from "./admin.graphql";
import { UserService } from "../user/user.service";
import { CompanyService } from "../compeny/company.service";
import { UserRepository } from "src/DB";
import { USER_ROLE } from "src/common";
import { ForbiddenException, NotFoundException } from "@nestjs/common";
import { UserGQL } from "../user/user.resolve";

@Resolver()
export class AdminReslove {
    constructor(
        private readonly userService: UserService,
        private readonly userRepository: UserRepository,
        private readonly companyService: CompanyService
    ) { }
    @Query(() => AdminGQL)
    async displayAllData() {
        const company = await this.companyService.searchCompanyByName('')
        const user = await this.userService.getAllUser();
        return { user, company };
    }
    @Query(() => String)
    sayHello() {
        return 'hello GQL'
    }

    //admin make user ban and 
    async banOrUnbanUser(id: string) {
        //check user exist
        const userExist = await this.userRepository.getOne({ _id: id });
        if (!userExist) {
            throw new NotFoundException('User not found');
        }
        if (userExist.role === USER_ROLE.ADMIN) {
            throw new ForbiddenException('you can\'t ban admin anther');
        }
        const userBan = await this.userRepository.updateOne({ _id: id }, { $set: { bannedAt: userExist.bannedAt ? null : new Date() } });
        return userBan;
    }
    @Mutation(() => UserGQL)
    async toBanOrUnBan(@Args('userId') userId: string) {
        const user = await this.banOrUnbanUser(userId);
        return  user ;

    }

}
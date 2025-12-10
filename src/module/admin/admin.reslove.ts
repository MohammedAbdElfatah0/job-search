import { ForbiddenException, NotFoundException, UseGuards } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { UserRepository } from "src/DB";
import { CompanyRepository } from "src/DB/model/compeny/compeny.repository";
import { Auth, AuthGuard, Roles, RolesGuards, USER_ROLE } from "src/common";
import { CompanyGQL } from "../compeny/company.resolve";
import { CompanyService } from "../compeny/company.service";
import { UserGQL } from "../user/user.resolve";
import { UserService } from "../user/user.service";
import { AdminGQL } from "./admin.graphql";

@Resolver()
// @UseGuards(Auth([USER_ROLE.ADMIN]))
@Roles([USER_ROLE.ADMIN])
@UseGuards(AuthGuard, RolesGuards)
export class AdminReslove {
    constructor(
        private readonly userService: UserService,
        private readonly userRepository: UserRepository,
        private readonly companyService: CompanyService,
        private readonly companyRepository: CompanyRepository
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
    private async banOrUnbanUser(id: string) {
        //check user exist
        const userExist = await this.userRepository.getOne({ _id: id, deletedAt: { $exists: false } });
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
    async BanOrUnBanUser(@Args('userId') userId: string) {
        const user = await this.banOrUnbanUser(userId);
        return user;

    }
    private async banAndUnBan(id: string) {
        const companyExist = await this.companyRepository.getOne({ _id: id, deletedAt: { $exists: false } })
        if (!companyExist) {
            throw new NotFoundException('Company not found');
        }
        const compantBan = await this.companyRepository.updateOne({ _id: id }, { $set: { bannedAt: companyExist.bannedAt ? null : new Date() } });
        return compantBan;
    }
    @Mutation(() => CompanyGQL)
    async BanOrUnBanCopmany(@Args('userId') userId: string) {
        const user = await this.banAndUnBan(userId);
        return user;

    }

    //approve company
    private async approveCompany(id: string) {
        const companyExist = await this.companyRepository.getOne({ _id: id, deletedAt: { $exists: false }, bannedAt: { $eq: null } })
        if (!companyExist) {
            throw new NotFoundException('Company not found');
        }
        const companyApprove = await this.companyRepository.updateOne({ _id: id }, { $set: { approvedByAdmin: true } });
        return companyApprove;

    }
    @Mutation(() => CompanyGQL)
    async ApproveCompany(@Args('userId') userId: string) {
        const user = await this.approveCompany(userId);
        return user;

    }

}
import { Field, ObjectType } from "@nestjs/graphql";
import { UserGQL } from "../user/user.resolve";
import { CompanyGQL } from "../compeny/company.resolve";

@ObjectType()
export class AdminGQL {
    @Field(type => [UserGQL], { nullable: true })
    user: UserGQL[];

    @Field(type => [CompanyGQL], { nullable: true })
    company: CompanyGQL[];
}

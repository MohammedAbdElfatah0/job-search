import { Field, ID, ObjectType, registerEnumType } from "@nestjs/graphql";
import { AttachmentGQL } from "../common/attachment.graphql";
import { USER_GENDER } from "src/common";


registerEnumType(USER_GENDER, {
    name: "USER_GENDER",
});

@ObjectType()
export class UserGQL {
    @Field(type => ID)
    _id: string;
    @Field(type => String)
    firstName: string;
    @Field(type => String)
    lastName: string;
    @Field(type => String)

    @Field(type => String)
    userName: string;

    email: string;
    @Field(type => String, { nullable: true })
    phone: string;
    @Field(type => String, { nullable: true })
    address: string;
    @Field(type => USER_GENDER)
    gender: USER_GENDER;
    @Field(type => AttachmentGQL, { nullable: true })
    profilePic?: AttachmentGQL;
    @Field(type => AttachmentGQL, { nullable: true })
    coverPic?: AttachmentGQL;
    @Field(type => String)
    createdAt: string;
    @Field(type => String)
    updatedAt: string;
    @Field(type => String, { nullable: true })
    deletedAt?: string;
    @Field(type => Date, { nullable: true })
    bannedAt: Date;

}
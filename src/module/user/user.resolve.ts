import { Field, ID, ObjectType, registerEnumType } from "@nestjs/graphql";
import { AttachmentGQL } from "../common/attachment.graphql";
import { typeOtp, USER_GENDER } from "src/common";
import { Types } from "mongoose";

registerEnumType(USER_GENDER, {
    name: "USER_GENDER",
});


@ObjectType()
export class UserGQL {
    @Field(type => ID)
    _id: Types.ObjectId;
    @Field(type => String)
    firstName: string;

    @Field(type => String)
    lastName: string;

    @Field(type => String)
    userName: string;

    @Field(type => String)
    email: string;

    @Field(type => USER_GENDER)
    gender: USER_GENDER;

    @Field(type => String, { nullable: true })
    dob?: Date;

    @Field(type => AttachmentGQL, { nullable: true })
    profilePic?: AttachmentGQL;

    @Field(type => AttachmentGQL, { nullable: true })
    coverPic?: AttachmentGQL;

    @Field(type => Date, { nullable: true })
    bannedAt?: Date;

    // لو عايز ترجع role
    @Field(type => String, { nullable: true })
    role?: string;









}

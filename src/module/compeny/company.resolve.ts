import { Field, ID, ObjectType } from '@nestjs/graphql';
import { AttachmentGQL } from '../common/attachment.graphql';


@ObjectType()
export class CompanyGQL {
    @Field(type => ID)
    _id: string;

    @Field(type => String)
    companyName: string;

    @Field(type => String)
    description: string;

    @Field(type => String)
    industry: string;

    @Field(type => String)
    address: string;

    @Field(type => String)
    numberOfEmployees: string;

    @Field(type => String)
    companyEmail: string;

    @Field(type => String)
    createdBy: string; // ObjectId → String في GraphQL

    @Field(type => AttachmentGQL, { nullable: true })
    logo?: AttachmentGQL;

    @Field(type => AttachmentGQL, { nullable: true })
    coverPic?: AttachmentGQL;

    @Field(type => [String])
    HRs: string[];

    @Field(type => Date, { nullable: true })
    bannedAt?: Date;

    @Field(type => Date, { nullable: true })
    deletedAt?: Date;

    @Field(type => AttachmentGQL, { nullable: true })
    legalAttachment?: AttachmentGQL;

    @Field(type => Boolean)
    approvedByAdmin: boolean;
}

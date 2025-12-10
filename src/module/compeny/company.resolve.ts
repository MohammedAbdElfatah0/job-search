import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AttachmentGQL {
    @Field(() => String, { nullable: true })
    secure_url: string;

    @Field(() => String, { nullable: true })
    public_id: string;
}

@ObjectType()
export class CompanyGQL {
    @Field(() => ID)
    _id: string;

    @Field(() => String)
    companyName: string;

    @Field(() => String)
    description: string;

    @Field(() => String)
    industry: string;

    @Field(() => String)
    address: string;

    @Field(() => String)
    numberOfEmployees: string;

    @Field(() => String)
    companyEmail: string;

    @Field(() => String)
    createdBy: string; // ObjectId → String في GraphQL

    @Field(() => AttachmentGQL, { nullable: true })
    logo?: AttachmentGQL;

    @Field(() => AttachmentGQL, { nullable: true })
    coverPic?: AttachmentGQL;

    @Field(() => [String])
    HRs: string[];

    @Field(() => Date, { nullable: true })
    bannedAt?: Date;

    @Field(() => Date, { nullable: true })
    deletedAt?: Date;

    @Field(() => AttachmentGQL, { nullable: true })
    legalAttachment?: AttachmentGQL;

    @Field(() => Boolean)
    approvedByAdmin: boolean;
}

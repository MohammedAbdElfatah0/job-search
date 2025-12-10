import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class AttachmentGQL {
    @Field(() => String, { nullable: true })
    secure_url: string;

    @Field(() => String, { nullable: true })
    public_id: string;
}

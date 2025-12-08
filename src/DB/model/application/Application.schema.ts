import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { ApplicationStatus } from "src/common";

@Schema({ timestamps: true })
export class Application {

    // 1. Job Id
    @Prop({ type: Types.ObjectId, ref: "JobOpportunity", required: true })
    jobId: Types.ObjectId;

    // 2. User Id (Applier)
    @Prop({ type: Types.ObjectId, ref: "User", required: true })
    userId: Types.ObjectId;

    // 3. User CV { secure_url, public_id }
    @Prop({
        type: {
            secure_url: { type: String, required: true },
            public_id: { type: String, required: true },
        },
        required: true,
    })
    userCV: {
        secure_url: string;
        public_id: string;
    };

    // 4. Status (default: 'pending')
    @Prop({
        type: String,
        enum: ApplicationStatus,
        default: ApplicationStatus.PENDING,
    })
    status: ApplicationStatus;
    //--reason ?? to send mail for user 
    @Prop({
        type: String,
    })
    reason: string;
}

export type ApplicationDocument = Application & Document;
export const ApplicationSchema = SchemaFactory.createForClass(Application);

// Model export
export const ApplicationModel = MongooseModule.forFeature([
    { name: Application.name, schema: ApplicationSchema },
]);

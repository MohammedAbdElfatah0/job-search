import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { JOBLOCATION, SENIORITYLEVEL, WORKINGTIME } from "src/common";

@Schema({ timestamps: true })
export class JobOpportunity {

    // 1. Job Title
    @Prop({ type: String, required: true, trim: true })
    jobTitle: string;

    // 2. Job Location
    @Prop({
        type: String,
        required: true,
        enum: JOBLOCATION,
    })
    jobLocation: JOBLOCATION;

    // 3. Working Time
    @Prop({
        type: String,
        required: true,
        enum: WORKINGTIME,
    })
    workingTime: WORKINGTIME;

    // 4. Seniority Level
    @Prop({
        type: String,
        required: true,
        enum: SENIORITYLEVEL,
    })
    seniorityLevel: SENIORITYLEVEL;

    // 5. Job Description
    @Prop({ type: String, required: true })
    jobDescription: string;

    // 6. Technical Skills
    @Prop({ type: [String], default: [] })
    technicalSkills: string[];

    // 7. Soft Skills
    @Prop({ type: [String], default: [] })
    softSkills: string[];

    // 8. addedBy (HR)
    @Prop({ type: Types.ObjectId, ref: "User", required: true })
    addedBy: Types.ObjectId;

    // 9. updatedBy (HR)
    @Prop({ type: Types.ObjectId, ref: "User", default: null })
    updatedBy: Types.ObjectId;

    // 10. closed
    @Prop({ type: Boolean, default: false })
    closed: boolean;

    // 11. companyId
    @Prop({ type: Types.ObjectId, ref: "Compeny", required: true })
    companyId: Types.ObjectId;
}

export type JobOpportunityDocument = JobOpportunity & Document;
export const JobOpportunitySchema = SchemaFactory.createForClass(JobOpportunity);
export const JobOpportunityModel = MongooseModule.forFeature([
    { name: JobOpportunity.name, schema: JobOpportunitySchema },
]);

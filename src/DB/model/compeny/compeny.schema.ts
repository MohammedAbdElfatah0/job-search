import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
})
export class Compeny {

    @Prop({ type: String, required: true, unique: true, trim: true })
    companyName: string;


    @Prop({ type: String, required: true })
    description: string;


    @Prop({ type: String, required: true })
    industry: string;


    @Prop({ type: String, required: true })
    address: string;


    @Prop({ type: String, required: true })
    numberOfEmployees: string;


    @Prop({ type: String, required: true, unique: true, lowercase: true })
    companyEmail: string;


    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    createdBy: Types.ObjectId;


    @Prop({
        type: {
            secure_url: String,
            public_id: String,
        },
        default: null,
    })
    logo: {
        secure_url: string;
        public_id: string;
    };


    @Prop({
        type: {
            secure_url: String,
            public_id: String,
        },
        default: null,
    })
    coverPic: {
        secure_url: string;
        public_id: string;
    };


    @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
    HRs: Types.ObjectId[];


    @Prop({ type: Date, default: null })
    bannedAt: Date;


    @Prop({ type: Date, default: null })
    deletedAt: Date;


    @Prop({
        type: {
            secure_url: String,
            public_id: String,
        },
        default: null,
    })
    legalAttachment: {
        secure_url: string;
        public_id: string;
    };


    @Prop({ type: Boolean, default: false })
    approvedByAdmin: boolean;
}

export type CompenyDocument = Compeny & Document;
export const CompenySchema = SchemaFactory.createForClass(Compeny);

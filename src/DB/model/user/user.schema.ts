import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { USER_GENDER, USER_PROVIDER, USER_ROLE } from 'src/common';

@Schema({ timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } })
export class User {
    @Prop({ type: String, required: true, trim: true })
    firstName: string;

    @Prop({ type: String, required: true, trim: true })
    lastName: string;


    get userName() {
        return `${this.firstName} ${this.lastName}`;
    }

    set userName(value: string) {
        const [first, last] = value.split(' ');
        this.firstName = first;
        this.lastName = last;
    }

    @Prop({ type: String, required: true, unique: true, trim: true })
    email: string;

    @Prop({ type: String, required: true })
    password: string;

    @Prop({ type: String, enum: USER_ROLE, default: USER_ROLE.USER })
    role: USER_ROLE;

    @Prop({ type: String, enum: USER_PROVIDER, default: USER_PROVIDER.SYSTEM })
    provider: USER_PROVIDER;

    @Prop({ type: String, enum: USER_GENDER, default: USER_GENDER.MALE })
    gender: USER_GENDER;

    @Prop({
        type: Date,
        required: true,
        validate: {
            validator(value: Date) {
                const today = new Date();
                const age = today.getFullYear() - value.getFullYear();
                return age >= 18;
            },
            message: 'Age must be at least 18 years old',
        },
    })
    dob: Date;

    @Prop({ type: String, required: true })
    mobileNumber: string;

    @Prop({ type: Boolean, default: false })
    isConfirmed: boolean;

    @Prop({ type: Date })
    deletedAt: Date;

    @Prop({ type: Date })
    bannedAt: Date;

    @Prop({ type: Types.ObjectId, ref: 'User' })
    updatedBy: string;

    @Prop({ type: Date, default: Date.now })
    changeCredentialTime: Date;

    @Prop({
        type: {
            secure_url: String,
            public_id: String,
        },
    })
    profilePic: {
        secure_url: string;
        public_id: string;
    };

    @Prop({
        type: {
            secure_url: String,
            public_id: String,
        },
    })
    coverPic: {
        secure_url: string;
        public_id: string;
    };

    @Prop([
        {
            code: String, // hashed OTP
            type: { type: String, enum: ['confirmEmail', 'forgetPassword'] },
            expiresIn: Date,
        },
    ])
    otp: {
        code: string;
        type: 'confirmEmail' | 'forgetPassword';
        expiresIn: Date;
    }[];
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);

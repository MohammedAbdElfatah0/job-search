import { MongooseModule, Prop, Schema, SchemaFactory, Virtual } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { generateExpiryTime, generateOtp, USER_GENDER, USER_PROVIDER, USER_ROLE } from 'src/common';
import { confirmEmailTemplate, CryptoHelper, generatedHash, sendEmailHelper, typeOtp } from 'src/common/utils';

@Schema({ timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } })
export class User {
    readonly _id: Types.ObjectId;
    @Prop({ type: String, required: true, trim: true })
    firstName: string;

    @Prop({ type: String, required: true, trim: true })
    lastName: string;

    @Virtual({
        get: function () {
            return `${this.firstName} ${this.lastName}`;
        },
        set: function (value: string) {
            const [first, last] = value.split(' ');
            this.firstName = first as string;
            this.lastName = last as string;
        }
    })
    userName: string;

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
        get: (value: Date) => {
            if (!value) return value;

            const day = value.getDate().toString().padStart(2, '0');
            const month = (value.getMonth() + 1).toString().padStart(2, '0');
            const year = value.getFullYear();

            return `${day}/${month}/${year}`;
        },
    })
    dob: Date;
    @Prop({
        type: {
            content: String,
            iv: String,
        },
        _id: false,
        get: (value) => {
            if (!value) return null;
            return CryptoHelper.decrypt(value);
        },
        set: (value: string) => {
            return CryptoHelper.encrypt(value);
        },
    })
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
        _id: false
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
        _id: false
    })
    coverPic: {
        secure_url: string;
        public_id: string;
    };

    @Prop([
        {
            code: String, // hashed OTP
            type: { type: String, enum: typeOtp },
            expiresIn: Date,
            _id: false
        },

    ],)
    otp: {
        code: string;
        type: typeOtp;
        expiresIn: Date;
    }[];
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.pre("save", async function (next) {
    if (!this.isConfirmed) {
        const code = generateOtp();
        const expiresIn = generateExpiryTime(10);
        //send email confirm email
        sendEmailHelper({
            to: this.email,
            subject: 'Confirm Your Email',
            html: confirmEmailTemplate(code),
        });
        this.otp.push({ code: await generatedHash(code), type: typeOtp.confirmEmail, expiresIn });


    }
    next();
});
//user module
export const UserModule = MongooseModule.forFeature([{
    name: User.name,
    schema: UserSchema,
}])
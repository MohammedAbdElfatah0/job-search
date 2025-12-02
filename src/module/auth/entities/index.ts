import { Types } from "mongoose";
import { SEND_TYPE, USER_GENDER, USER_PROVIDER } from "src/common";

export class User {
    readonly _id: Types.ObjectId;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: string;
    updatedAt: Date;
    gneder: USER_GENDER;
    provider: USER_PROVIDER;
    dob: Date;
    isConfirmed: boolean;
    mobileNumber: string
    deletedAt: Date;
    bannedAt: Date;
    updatedBy: Types.ObjectId;
    changeCredentialTime: Date;
    profilePic: {
        secure_url: string;
        public_id: string;
    }
    coverPic: {
        secure_url: string;
        public_id: string;
    }

    otp: {
        code: string;
        type: SEND_TYPE;
        expiresAt: Date;
    }

}
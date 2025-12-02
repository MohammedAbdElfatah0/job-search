import { IsNotEmpty, IsString, Length } from "class-validator";
import { ResendOtpDto } from "./resend_otp-auth.dto";

export class ConfirmEmailDto extends ResendOtpDto {
//include eamil
    @Length(6, 6, { message: "OTP must be 6 characters long" })
    @IsString({ message: "OTP must be a string" })
    @IsNotEmpty({ message: "OTP is required" })
    otp: string;

}
import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";

export class ConfirmEmailDto {
    @IsEmail({}, { message: "Email must be a valid email address" })
    @IsString({ message: "Email must be a string" })
    @IsNotEmpty({ message: "Email is required" })
    email: string;
//validation for otp a
    @Length(6, 6, { message: "OTP must be 6 characters long" })
    @IsString({ message: "OTP must be a string" })
    @IsNotEmpty({ message: "OTP is required" })
    otp: string;

}
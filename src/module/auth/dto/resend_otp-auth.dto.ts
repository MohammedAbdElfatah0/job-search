import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class ResendOtpDto {
    @IsEmail({}, { message: "Email must be a valid email address" })
    @IsString({ message: "Email must be a string" })
    @IsNotEmpty({ message: "Email is required" })
    email: string;
}
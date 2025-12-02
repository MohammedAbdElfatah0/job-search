import { IsNotEmpty, IsString } from "class-validator";
import { ResendOtpDto } from "./resend_otp-auth.dto";

export class LoginDto extends ResendOtpDto {

    @IsString({ message: "Password must be a string" })
    @IsNotEmpty({ message: "Password is required" })
    password: string;
}
import { IsNotEmpty, IsString } from "class-validator";
import { ConfirmEmailDto } from "./confirm_email-auth.dto";

export class ResetPasswordDto extends ConfirmEmailDto {

    @IsString({ message: "Password must be a string" })
    @IsNotEmpty({ message: "Password is required" })
    password: string;

}
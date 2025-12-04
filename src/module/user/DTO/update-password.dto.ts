import { IsNotEmpty, IsString } from "class-validator";

export class UpdatePasswordDto {
    @IsString({message:"oldPassword must be a string"})
    @IsNotEmpty({message:"oldPassword is required"})
    oldPassword: string;
    @IsString({message:"newPassword must be a string"})
    @IsNotEmpty({message:"newPassword is required"})
    newPassword: string;
    //confirm password
}
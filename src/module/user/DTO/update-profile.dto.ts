import { Type } from "class-transformer";
import { IsDate, IsNotEmpty, IsString } from "class-validator";
import { IsAdult } from "src/common";

export class UpdateProfileDto {
    @IsString()

    firstName: string;
    @IsString()

    lastName: string;
    @IsString()

    mobileNumber: string;

    @IsString()
    gender: string;


    @IsDate()
    @Type(() => Date)
    @IsAdult()

    dob: Date;
}
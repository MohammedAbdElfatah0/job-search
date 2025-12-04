import { Type } from "class-transformer";
import { IsDate, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { IsAdult, USER_GENDER } from "src/common";

export class UpdateProfileDto {
    @IsString({ message: 'firstName is must be string' })
    @IsOptional()
    firstName: string;
    @IsString({ message: 'lastName is must be string' })
    @IsOptional()
    lastName: string;
    @IsString({ message: 'mobileNumber is must be string' })
    @IsOptional()
    mobileNumber: string;

    @IsString({ message: 'gender is must be string' })
    @IsEnum(USER_GENDER, { message: `gender is must be enum  ${USER_GENDER.MALE} , ${USER_GENDER.FEMALE}   ` })
    @IsOptional()
    gender: USER_GENDER;


    @IsDate({ message: 'dob is formated in date' })
    @Type(() => Date)
    @IsAdult()
    @IsOptional()
    dob: Date;
}
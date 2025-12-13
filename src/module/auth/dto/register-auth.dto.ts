import { Type } from "class-transformer";
import { IsDate, IsEnum, IsNotEmpty, IsString, Length } from "class-validator";
import { IsAdult, USER_GENDER, USER_ROLE } from "../../../common";
import { LoginDto } from "./login-auth.dto";

export class RegisterAuthDto extends LoginDto {
    @Length(3, 20, { message: "First name must be at least 3 characters and maximum 20 characters" })
    @IsString({ message: "First name must be a string" })
    @IsNotEmpty({ message: "First name is required" })
    firstName: string;

    @Length(3, 20, { message: "Last name must be at least 3 characters and maximum 20 characters" })
    @IsString({ message: "Last name must be a string" })
    @IsNotEmpty({ message: "Last name is required" })
    lastName: string;




    @IsEnum(USER_ROLE, { message: `Role must be a valid role[${USER_ROLE.USER} or ${USER_ROLE.ADMIN}]` })
    @IsString({ message: "Role must be a string" })
    @IsNotEmpty({ message: "Role is required" })
    role: USER_ROLE;

    @IsEnum(USER_GENDER, { message: `Gender must be a valid gender[${USER_GENDER.MALE} or ${USER_GENDER.FEMALE}]` })
    @IsString({ message: "Gender must be a string" })
    @IsNotEmpty({ message: "Gender is required" })
    gender: USER_GENDER;



    @IsDate()
    @Type(() => Date)
    @IsAdult()
    @IsNotEmpty({ message: "Date of birth is required" })
    dob: Date;

    @IsString({ message: "Mobile number must be a string" })
    @IsNotEmpty({ message: "Mobile number is required" })
    mobileNumber: string;


}
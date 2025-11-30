import { Type } from "class-transformer";
import { IsDate, IsEmail, IsEnum, IsNotEmpty, IsObject, IsString, Min } from "class-validator";
import { USER_GENDER, USER_PROVIDER, USER_ROLE } from "src/common";

export class RegisterAuthDto {
    @Min(3, { message: "First name must be at least 3 characters long" })
    @IsString({ message: "First name must be a string" })
    @IsNotEmpty({ message: "First name is required" })
    firstName: string;

    @Min(3, { message: "Last name must be at least 3 characters long" })
    @IsString({ message: "Last name must be a string" })
    @IsNotEmpty({ message: "Last name is required" })
    lastName: string;

    @IsEmail({}, { message: "Email must be a valid email address" })
    @IsString({ message: "Email must be a string" })
    @IsNotEmpty({ message: "Email is required" })
    email: string;

    @Min(6, { message: "Password must be at least 6 characters long" })
    @IsString({ message: "Password must be a string" })
    @IsNotEmpty({ message: "Password is required" })
    password: string;

    @IsEnum(USER_ROLE, { message: `Role must be a valid role[${USER_ROLE.USER} or ${USER_ROLE.ADMIN}]` })
    @IsString({ message: "Role must be a string" })
    @IsNotEmpty({ message: "Role is required" })
    role: USER_ROLE;

    @IsEnum(USER_GENDER, { message: `Gender must be a valid gender[${USER_GENDER.MALE} or ${USER_GENDER.FEMALE}]` })
    @IsString({ message: "Gender must be a string" })
    @IsNotEmpty({ message: "Gender is required" })
    gneder: USER_GENDER;

    @IsEnum(USER_PROVIDER, { message: `Provider must be a valid provider[${USER_PROVIDER.SYSTEM} or ${USER_PROVIDER.GOOGLE}]` })
    @IsString({ message: "Provider must be a string" })
    @IsNotEmpty({ message: "Provider is required" })
    provider: USER_PROVIDER;

    @IsDate()
    @Type(() => Date)
    // @IsAdult()
    dob: Date;

    @IsString({ message: "Mobile number must be a string" })
    @IsNotEmpty({ message: "Mobile number is required" })
    mobileNumber: string;
    @IsObject({ each: true, message: "Profile picture is Object { secure_url: string; public_id: string; }" })
    @IsNotEmpty(
        {
            message: "Profile picture is required"
        }
    )
    profilePic: {
        secure_url: string;
        public_id: string;
    }
    @IsObject({ each: true, message: "Cover picture is Object { secure_url: string; public_id: string; }" })
    @IsNotEmpty(
        {
            message: "Cover picture is required"
        }
    )
    coverPic: {
        secure_url: string;
        public_id: string;
    }
}
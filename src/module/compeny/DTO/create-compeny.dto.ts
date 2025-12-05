import { IsEmail, IsNotEmpty, IsNumberString, IsOptional, IsString } from "class-validator";

export class CreateCompanyDto {
    
    @IsString({ message: 'companyName must be a string' })
    @IsNotEmpty({ message: 'companyName is required' })
    companyName: string;

    @IsString({ message: 'description must be a string' })
    @IsOptional()
    description: string;

    @IsString({ message: 'industry must be a string' })
    @IsNotEmpty({ message: 'industry is required' })
    industry: string;

    @IsString({ message: 'address must be a string' })
    @IsNotEmpty({ message: 'address is required' })
    address: string;

    @IsNumberString({}, { message: 'numberOfEmployees must be a number' })
    @IsNotEmpty({ message: 'numberOfEmployees is required' })
    numberOfEmployees: string;

    @IsEmail({}, { message: 'companyEmail must be a valid email address' })
    @IsNotEmpty({ message: 'companyEmail is required' })
    companyEmail: string;
}

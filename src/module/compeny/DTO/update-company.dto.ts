import { ArrayNotEmpty, IsArray, IsMongoId, IsOptional, IsString } from "class-validator";

export class UpdateCompanyDto {
    @IsString({ message: 'companyName must be a string' })
    @IsOptional()
    companyName: string;

    @IsString({ message: 'description must be a string' })
    @IsOptional()
    description: string;

    @IsString({ message: 'industry must be a string' })
    @IsOptional()
    industry: string;

    @IsString({ message: 'address must be a string' })
    @IsOptional()
    address: string;

    @IsOptional()
    numberOfEmployees: string;

    @IsOptional()
    companyEmail: string;

    @IsArray({ message: 'HRs must be an array' })
    @ArrayNotEmpty({ message: 'HRs must not be empty' })
    @IsMongoId({ each: true, message: 'HRs must be array of MongoDB ObjectId' })
    @IsOptional()
    HRs: string[];
}
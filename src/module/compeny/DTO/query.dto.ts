import { IsOptional, IsString, Length } from "class-validator";

export class QueryDto {
    @Length(1)
    @IsString({ message: "It's must be string" })
    @IsOptional()
    name: string
}
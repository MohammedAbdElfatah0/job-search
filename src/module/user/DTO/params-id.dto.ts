import { IsMongoId, IsNotEmpty } from "class-validator";

export class ParamsIdDto {
    @IsNotEmpty({ message: "Id is required" })
    @IsMongoId({ message: "Id must be a valid MongoDB ID" })
    id: string;
}
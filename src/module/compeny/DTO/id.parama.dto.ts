import { IsMongoId, IsNotEmpty } from "class-validator";

export class ParamsIdDto {
    @IsMongoId({ message: "Id must be a valid MongoDB ID" })
    @IsNotEmpty({ message: "Id is required" })
    id: string;
}
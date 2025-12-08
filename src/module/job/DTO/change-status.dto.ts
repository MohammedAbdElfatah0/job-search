import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { ApplicationStatus } from "src/common";

export class ChangeStausDto {
    @IsEnum(ApplicationStatus, { message: `status must be ${ApplicationStatus.ACCEPTED},${ApplicationStatus.REJECTED}` })
    @IsString({ message: "status must be string" })
    @IsNotEmpty({ message: "status is required" })
    status: ApplicationStatus;
    @IsString({ message: "reason must be string" })
    @IsNotEmpty({ message: "reason is required" })
    reason: string;
}
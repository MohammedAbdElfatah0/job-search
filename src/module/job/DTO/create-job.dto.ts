import { IsArray, IsEnum, IsNotEmpty, IsString } from "class-validator";
import { JOBLOCATION, SENIORITYLEVEL, WORKINGTIME } from "../../../common";

export class CreateJobDto {
    @IsString({ message: 'jobTitle must be string' })
    @IsNotEmpty({ message: 'jobTitle required' })
    jobTitle: string;

    // 2. Job Location
    @IsEnum(JOBLOCATION, { message: `value is ${JOBLOCATION.ONSITE},${JOBLOCATION.HYBRID},${JOBLOCATION.REMOTELY}` })
    @IsString({ message: 'jobLocation must be string' })
    @IsNotEmpty({ message: 'jobLocation required' })
    jobLocation: JOBLOCATION;
    @IsEnum(WORKINGTIME, { message: `value is ${WORKINGTIME.FULLTIME},${WORKINGTIME.PARTTIME},` })
    @IsString({ message: 'workingTime must be string' })
    @IsNotEmpty({ message: 'workingTime required' })
    // 3. Working Time
    workingTime: WORKINGTIME;

    // 4. Seniority Level
    @IsEnum(SENIORITYLEVEL, { message: `value is ${SENIORITYLEVEL.JUNIOR},${SENIORITYLEVEL.MIDLEVEL},${SENIORITYLEVEL.SENIOR},${SENIORITYLEVEL.FRESH},${SENIORITYLEVEL.TEAMLEAD},${SENIORITYLEVEL.CTO}` })
    @IsString({ message: 'seniorityLevel must be string' })
    @IsNotEmpty({ message: 'seniorityLevel required' })
    seniorityLevel: SENIORITYLEVEL;

    // 5. Job Description
    @IsString({ message: "jobDescription must be string" })
    @IsNotEmpty({ message: "jobDescription required" })
    jobDescription: string;

    // 6. Technical Skills
    @IsArray({ message: "technicalSkills must be an array" })
    @IsString({ each: true, message: "each technical skill must be string" })
    @IsNotEmpty({ message: "technicalSkills required" })
    technicalSkills: string[];

    // 7. Soft Skills
    @IsArray({ message: "softSkills must be an array" })
    @IsString({ each: true, message: "each soft skill must be string" })
    @IsNotEmpty({ message: "softSkills required" })
    softSkills: string[];

}
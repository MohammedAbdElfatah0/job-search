import { IsArray, IsEnum, IsNotEmpty, IsString } from "class-validator";
import { JOBLOCATION, SENIORITYLEVEL, WORKINGTIME } from "src/common";

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
    @IsString({ message: "technicalSkills must be string" })
    @IsArray({ each: true, message: "it must be array" })
    @IsNotEmpty({ message: "technicalSkills required" })
    technicalSkills: string[];

    // 7. Soft Skills
    @IsString({ message: 'softSkills must be string' })
    @IsArray({ each: true, message: 'it must be array' })
    @IsNotEmpty({ message: 'softSkills required' })
    softSkills: string[];

}
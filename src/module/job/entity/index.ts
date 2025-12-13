import { Types } from "mongoose";
import { JOBLOCATION, SENIORITYLEVEL, WORKINGTIME } from "../../../common";

export class Job {
    readonly _id: Types.ObjectId;
    
    jobTitle: string;

    // 2. Job Location

    jobLocation: JOBLOCATION;

    // 3. Working Time
    workingTime: WORKINGTIME;

    // 4. Seniority Level
    seniorityLevel: SENIORITYLEVEL;

    // 5. Job Description
    jobDescription: string;

    // 6. Technical Skills
    technicalSkills: string[];

    // 7. Soft Skills
    softSkills: string[];

    // 8. addedBy (HR)
    addedBy: Types.ObjectId;

    // 9. updatedBy (HR)
    updatedBy: Types.ObjectId;

    // 10. closed
    closed: boolean;

    // 11. companyId
    companyId: Types.ObjectId;
}
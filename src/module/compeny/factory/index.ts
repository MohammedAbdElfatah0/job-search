import { User } from "src/DB";
import { CreateCompanyDto } from "../DTO";
import { Company } from "../entities";


export class CompanyFactoryService {



    public createCompany(createCompanyDto: CreateCompanyDto, user: User) {
        const company = new Company();
        company.companyName = createCompanyDto.companyName;
        company.companyEmail = createCompanyDto.companyEmail;
        company.description = createCompanyDto.description;
        company.industry = createCompanyDto.industry;
        company.address = createCompanyDto.address;
        company.numberOfEmployees = createCompanyDto.numberOfEmployees;
        //----
        company.HRs = [user._id];
        company.approvedByAdmin = false;
        company.createdBy = user._id;

        return company;

    }
    
}
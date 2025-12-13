import { Injectable } from "@nestjs/common";
import { User } from "../../../DB";
import { CloudinaryService } from "../../../common";
import { CreateCompanyDto, UpdateCompanyDto } from "../DTO";
import { Company } from "../entities";


@Injectable()
export class CompanyFactoryService {
    constructor(
        private readonly cloudinary: CloudinaryService,
    ) { }


    public async createCompany(createCompanyDto: CreateCompanyDto, user: User, file: Express.Multer.File) {
        const company = new Company();
        company.companyName = createCompanyDto.companyName;
        company.companyEmail = createCompanyDto.companyEmail;
        company.description = createCompanyDto.description;
        company.industry = createCompanyDto.industry;
        company.address = createCompanyDto.address;
        company.numberOfEmployees = createCompanyDto.numberOfEmployees;
        //--
        const legalAttachment = await this.cloudinary.uploadFile(
            file,
            `JobSearch/${user._id}/company/legalAttachment/`,
        )
        company.legalAttachment = {
            secure_url: legalAttachment.secure_url,
            public_id: legalAttachment.display_name,
        }
        //----
        company.HRs = [user._id];
        company.approvedByAdmin = false;
        company.createdBy = user._id;
        

        return company;

    }
    public async updateCompany(updateCompanyDto: UpdateCompanyDto, oldCompanyInfo: any) {
        const company = new Company();
        company.companyName = updateCompanyDto.companyName ?? oldCompanyInfo.companyName;
        company.companyEmail = updateCompanyDto.companyEmail ?? oldCompanyInfo.companyEmail;
        company.description = updateCompanyDto.description ?? oldCompanyInfo.description;
        company.industry = updateCompanyDto.industry ?? oldCompanyInfo.industry;
        company.address = updateCompanyDto.address ?? oldCompanyInfo.address;
        company.numberOfEmployees = updateCompanyDto.numberOfEmployees ?? oldCompanyInfo.numberOfEmployees;

        const newHRs = updateCompanyDto.HRs
            ? updateCompanyDto.HRs.filter(newHR => !oldCompanyInfo.HRs.some(oldHR => oldHR.equals(newHR)))
            : [];

        company.HRs = oldCompanyInfo.HRs
            ? [...oldCompanyInfo.HRs, ...newHRs]
            : oldCompanyInfo.HRs;

        company.legalAttachment = oldCompanyInfo.legalAttachment;
        company.approvedByAdmin = oldCompanyInfo.approvedByAdmin;
        company.createdBy = oldCompanyInfo.createdBy;
        company.coverPic = oldCompanyInfo.coverPic;
        company.logo = oldCompanyInfo.logo;
        return company;
    }

}
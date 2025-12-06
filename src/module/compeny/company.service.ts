import { BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { CompanyRepository } from "src/DB/model/compeny/compeny.repository";
import { Company } from "./entities";
import { UpdateCompanyDto } from "./DTO/update-company.dto";
import { User } from "src/DB";
import { Types } from "mongoose";
import { CompanyFactoryService } from "./factory";
import { CloudinaryService } from "src/common";
import { CreateCompanyDto } from "./DTO";

@Injectable()
export class CompanyService {
    constructor(
        private readonly companyRepository: CompanyRepository,
        private readonly companyFactory: CompanyFactoryService,
        private readonly cloudinaryService: CloudinaryService,
    ) { }


    //todo sove bug when error ->them done upload file
    public async createCompany(createCompanyDto: CreateCompanyDto, user: User, file: Express.Multer.File): Promise<any> {
        //get company factory - user?
        const companyExist = await this.companyRepository.getOne({
            $or: [
                { companyEmail: createCompanyDto.companyEmail },
                { companyName: createCompanyDto.companyName }
            ]
        });
        if (companyExist) {
            throw new ConflictException("Company already exists");
        }
        const companyFactory = await this.companyFactory.createCompany(createCompanyDto, user, file);
        //update to save    
        const createdCompany = await this.companyRepository.create(companyFactory);
        const { approvedByAdmin, legalAttachment, ...responde } = createdCompany.toObject();
        return responde;
    }

    public async updateCompanyInfo(id: string | Types.ObjectId, updateCompanyDto: UpdateCompanyDto, user: User): Promise<any> {
        const companyExistCheck = await this.companyRepository.getOne({
            $or: [
                { companyEmail: updateCompanyDto.companyEmail },
                { companyName: updateCompanyDto.companyName },

            ],
            _id: { $ne: id },
            deletedAt: { $exists: false }
        })
        if (companyExistCheck) {
            throw new ConflictException("Company already exists");
        }
        const company = await this.companyRepository.getOne({ _id: id });
        if (!new Types.ObjectId(user._id).equals(company?.createdBy)) {
            throw new UnauthorizedException('you con\'t modify this company')
        }
        //updated company
        const updatedCompany = await this.companyFactory.updateCompany(updateCompanyDto, company);
        await this.companyRepository.updateOne({ _id: id }, updatedCompany);

        const { approvedByAdmin, legalAttachment, ...result } = updatedCompany;
        return result;
    }

    public async SoftDeleteCompany(id: string | Types.ObjectId, user: User): Promise<any> {
        //check company is exist
        console.log({ id })
        const companyExist = await this.companyRepository.getOne({ _id: id, deletedAt: { $exists: false } });
        console.log({ companyExist })
        if (!companyExist) {
            throw new NotFoundException("Company not found");
        }
        if (!new Types.ObjectId(user._id).equals(companyExist?.createdBy)) {
            throw new UnauthorizedException('you con\'t delete this company')
        }
        await Promise.all([
            companyExist.coverPic && this.deleteImageCover(user),
            companyExist.logo && this.deleteImageLogo(user),
            this.cloudinaryService.deleteEntireFolder(`JobSearch/${user._id}/company/`),
        ]);
        const deletedCompany = await this.companyRepository.softDeleteOne(id, { deletedAt: Date.now() },);
        return deletedCompany;
    }
    //working as get all and get by search
    async searchCompanyByName(name: string) {
        return this.companyRepository.getAll({
            companyName: { $regex: name, $options: 'i' },
            deletedAt: { $exists: false },
        });
    }
    public async getCompanyWithJobs(companyId: string) {
        const company = await this.companyRepository
            .getOne({ _id: companyId, deletedAt: { $exists: false } },
                { companyName: 1, companyEmail: 1, logo: 1, coverPic: 1, description: 1 },
                { populate: [{ path: 'jobs' }] });
        if (!company) throw new NotFoundException('Company not found');
        return company;
    }








    // /-----image upload/delete helper methods -----/

    private async uploadUserImage(
        type: "logo" | "coverPic",
        file: Express.Multer.File,
        user: User
    ) {
        const company = await this.companyRepository.getOne({ createdBy: user._id, deletedAt: { $exists: false } });
        if (!company) {
            throw new NotFoundException("Company not found");
        }
        if (!new Types.ObjectId(user._id).equals(company?.createdBy)) {
            throw new UnauthorizedException('you con\'t upload this company image')
        }

        const folder = type === "logo" ? "logo" : "cover";
        const currentImage = company[type];

        const uploaded = await this.cloudinaryService.uploadFile(
            file,
            `JobSearch/${company._id}/${folder}`,
            currentImage?.public_id
        );

        await this.companyRepository.updateOne(
            { _id: company._id },
            {
                $set: {
                    [type]: {
                        public_id: uploaded.display_name,
                        secure_url: uploaded.secure_url,
                    },
                },
            }
        );

        return {
            url: uploaded.secure_url,
            name: uploaded.original_filename,
            id: uploaded.display_name
        };
    }
    private async deleteUserImage(type: "coverPic" | "logo", user: User) {
        const company = await this.companyRepository.getOne({ createdBy: user._id, deletedAt: { $exists: false } });
        if (!company) {
            throw new NotFoundException("Company not found");
        }
        if (!new Types.ObjectId(user._id).equals(company?.createdBy)) {
            throw new UnauthorizedException('you con\'t delete this company image')
        }
        const image = company[type];

        if (!image) {
            throw new NotFoundException(`No ${type} found`);
        }

        const folder = type === "logo" ? "logo" : "cover";

        await this.cloudinaryService.deleteFile(
            `JobSearch/${company._id}/${folder}/${image.public_id}`
        );

        await this.companyRepository.updateOne(
            { _id: company._id },
            { $unset: { [type]: 1 } }
        );

        return `${type} deleted successfully`;
    }

    public uploadImageLogo(file: Express.Multer.File, user: User) {
        return this.uploadUserImage("logo", file, user);
    }

    public uploadImageCover(file: Express.Multer.File, user: User) {
        return this.uploadUserImage("coverPic", file, user);
    }

    public deleteImageLogo(user: User) {
        return this.deleteUserImage("logo", user);
    }

    public deleteImageCover(user: User) {
        return this.deleteUserImage("coverPic", user);
    }
}
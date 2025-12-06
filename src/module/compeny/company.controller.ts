import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { AuthGuard, createMulterOptions, User } from "src/common";
import { CompanyService } from "./company.service";
import { CreateCompanyDto, UpdateCompanyDto } from "./DTO";
import { CompanyFactoryService } from "./factory";

@Controller('company')
@UseGuards(AuthGuard)
export class CompanyController {
    constructor(
        private readonly companyService: CompanyService,
        private readonly companyFactory: CompanyFactoryService,
    ) { }

    @Get('name')
    async getCompanyWithName(@Query('name') name: string) {
        const data = await this.companyService.searchCompanyByName(name);
        return {
            message: 'Company retrieved successfully',
            data
        }
    }
    @Get(':id')
    async getCompanyWithJobs(@Param('id') id: string) {
        const data = await this.companyService.getCompanyWithJobs(id);
        return {
            message: 'Company with jobs retrieved successfully',
            data
        };
    }

    @Post()
    @UseInterceptors(
        FileInterceptor(
            'legalAttachment',
            createMulterOptions(50 * 1024 * 1024, ['image/jpg', 'image/png', 'application/pdf'])
        )
    )
    public async createCompany(
        @Body() createCompanyDto: CreateCompanyDto,
        @User() user: any,
        @UploadedFile() legalAttachment: Express.Multer.File
    ) {
        if (!legalAttachment) {
            throw new BadRequestException('legalAttachment is required');
        }
        const data = await this.companyService.createCompany(createCompanyDto, user, legalAttachment);

        return {
            message: 'Company created successfully',
            data
        };
    }
    @Put(':id')
    public async updateCompany(@Param('id') id: string, @Body() updateCompanyDto: UpdateCompanyDto, @User() user: any) {
        const data = await this.companyService.updateCompanyInfo(id, updateCompanyDto, user);
        return {
            message: 'Company updated successfully',
            data
        }
    }





    @Patch('update-logo-pic')
    @UseInterceptors(
        FileInterceptor('logo', createMulterOptions(10 * 1024 * 1024, ['image/jpg', 'image/png', 'image/jpeg']))
    )
    async updateLogoPic(@UploadedFile() logo: Express.Multer.File, @User() user: any) {
        if (!logo) {
            throw new BadRequestException("No file uploaded");
        }
        const data = await this.companyService.uploadImageLogo(logo, user);
        return {
            message: "Updated Successfully",
            data
        }
    }

    @Patch('update-cover-pic')
    @UseInterceptors(
        FileInterceptor('cover_pic', createMulterOptions(10 * 1024 * 1024, ['image/jpg', 'image/png', 'image/jpeg']))
    )
    async updateCoverPic(@UploadedFile() cover_pic: Express.Multer.File, @User() user: any) {
        if (!cover_pic) {
            throw new BadRequestException("No file uploaded");
        }
        const data = await this.companyService.uploadImageCover(cover_pic, user);
        return {
            message: "Updated Successfully",
            data
        }
    }



    @Delete('delete-logo-pic')
    async deleteLogoPic(@User() user: any) {
        const message = await this.companyService.deleteImageLogo(user);
        return {
            message,
            success: true
        }
    }

    @Delete('delete-cover-pic')
    async deleteCoverPic(@User() user: any) {
        const message = await this.companyService.deleteImageCover(user);
        return {
            message,
            success: true
        }
    }
    @Delete(':id')
    public async deleteCompany(@Param('id') id: string, @User() user: any) {
        //delete company
        const data = await this.companyService.SoftDeleteCompany(id, user);
        return {
            message: 'Company deleted successfully',
            data
        }
    }

}
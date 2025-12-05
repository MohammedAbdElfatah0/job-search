import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { User } from "src/common/decorator";
import { AuthGuard } from "src/common/guard";
import { ParamsIdDto, UpdatePasswordDto, UpdateProfileDto } from "./DTO";
import { UserService } from "./user.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { createMulterOptions } from "src/common";


@Controller("user")
@UseGuards(AuthGuard)
export class UserController {
    constructor(
        private readonly userService: UserService
    ) { }


    @Patch("update-profile")
    async updateProfile(@Body() updateProfileDto: UpdateProfileDto, @User() user: any) {
        const data = await this.userService.updateProfile(updateProfileDto, user)
        return {
            message: "Updated Successfully",
            success: true,
            data
        }
    }

    @Get()
    async GetProfileUser(@User() user: any) {
        const data = await this.userService.getProfileUser(user._id)
        return { message: "done", success: true, data }
    }

    @Get(":id")
    async GetProfileUserById(@Param() params: ParamsIdDto) {
        const data = await this.userService.getProfileUser(params.id)
        return { message: "done", success: true, data }
    }


    @Patch('update-password')
    async updatePassword(@Body() updatePasswordDto: UpdatePasswordDto, @User() user: any) {
        await this.userService.updatePassword(updatePasswordDto, user);
        return {
            message: "updated password Successfully",
            success: true
        }
    }


    @Patch('update-profile-pic')
    @UseInterceptors(
        FileInterceptor('profile_pic', createMulterOptions(10 * 1024 * 1024, ['image/jpg', 'image/png', 'image/jpeg']))
    )
    async updateProfilePic(@UploadedFile() profile_pic: Express.Multer.File, @User() user: any) {
        if (!profile_pic) {
            throw new BadRequestException("No file uploaded");
        }
        const data = await this.userService.uploadImageProfile(profile_pic, user);
        return {
            message: "Updated Successfully",
            success: true,
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
        const data = await this.userService.uploadImageCover(cover_pic, user);
        return {
            message: "Updated Successfully",
            success: true,
            data
        }
    }



    @Delete('delete-profile-pic')
    async deleteProfilePic(@User() user: any) {
        const message = await this.userService.deleteImageProfile(user);
        return {
            message,
            success: true
        }
    }

    @Delete('delete-cover-pic')
    async deleteCoverPic(@User() user: any) {
        const message = await this.userService.deleteImageCover(user);
        return {
            message,
            success: true
        }
    }


    @Delete()
    async deleteProfile(@User() user: any) {
        await this.userService.deleteAccount(user);
        return {
            message: "deleted Successfully",
            success: true
        }
    }
}
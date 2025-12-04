import { Body, Controller, Delete, Get, Param, Patch, UseGuards } from "@nestjs/common";
import { User } from "src/common/decorator";
import { AuthGuard } from "src/common/guard";
import { ParamsIdDto, UpdatePasswordDto, UpdateProfileDto } from "./DTO";
import { UserService } from "./user.service";


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
    updateProfilePic() { }

    @Patch('update-cover-pic')
    updateCoverPic() { }



    @Patch('delete-profile-pic')
    deleteProfilePic() { }

    @Patch('delete-cover-pic')
    deleteCoverPic() { }


    @Delete()
    async deleteProfile(@User() user: any) {
        await this.userService.deleteAccount(user);
        return {
            message: "deleted Successfully",
            success: true
        }
    }
}
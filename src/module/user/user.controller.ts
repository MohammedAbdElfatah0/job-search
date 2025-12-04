import { Controller, Get, Patch, Put } from "@nestjs/common";


@Controller("user")
export class UserController {
    constructor() { }


    @Patch("update-profile")
    updateProfile() { }

    @Get()
    GetProfileUser() { }

    @Get(":id")
    GetProfileUserById() { }


    @Patch('update-password')
    updatePassword() { }


    @Patch('update-profile-pic')
    updateProfilePic() { }

    @Patch('update-cover-pic')
    updateCoverPic() { }



    @Patch('delete-profile-pic')
    deleteProfilePic() { }

    @Patch('delete-cover-pic')
    deleteCoverPic() { }


    @Put()
    deleteProfile() { }
}
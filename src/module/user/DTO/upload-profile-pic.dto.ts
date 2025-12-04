import { IsNotEmpty, IsObject } from "class-validator";

export class UploadProfilePicDto {
    @IsObject({ each: true, message: "Profile picture is Object { secure_url: string; public_id: string; }" })
    @IsNotEmpty(
        {
            message: "Profile picture is required"
        }
    )
    profilePic: {
        secure_url: string;
        public_id: string;
    }
}
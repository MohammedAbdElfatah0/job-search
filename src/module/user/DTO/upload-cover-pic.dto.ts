import { IsNotEmpty, IsObject } from "class-validator";

export class UploadCoverPicDto {
    @IsObject({ each: true, message: "Cover picture is Object { secure_url: string; public_id: string; }" })
    @IsNotEmpty(
        {
            message: "Cover picture is required"
        }
    )
    coverPic: {
        secure_url: string;
        public_id: string;
    }
}
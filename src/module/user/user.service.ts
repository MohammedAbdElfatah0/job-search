import {
    BadRequestException,
    Injectable,
    NotFoundException,
    UnauthorizedException
} from "@nestjs/common";
import { Types } from "mongoose";
import { CloudinaryService, compereHash, generatedHash } from "src/common";
import { User, UserRepository } from "src/DB";
import { UpdatePasswordDto, UpdateProfileDto } from "./DTO";

@Injectable()
export class UserService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly cloudinaryService: CloudinaryService
    ) { }

    private async checkUserExist(user: User) {
        const userExist = await this.userRepository.getOne({
            _id: user._id,
            deletedAt: { $exists: false }
        });

        if (!userExist) {
            throw new NotFoundException("User not found");
        }

        return userExist;
    }

    private mapUserResponse(user: User) {
        return {
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            mobileNumber: user.mobileNumber,
            dob: user.dob,
            gender: user.gender,
        };
    }

    private extractUpdatedFields(dto: UpdateProfileDto) {
        const updateData: Partial<User> = {};
        for (const key in dto) {
            if (dto[key] !== undefined && dto[key] !== null) {
                updateData[key] = dto[key];
            }
        }
        return updateData;
    }

    public async updateProfile(updateProfileDto: UpdateProfileDto, user: User) {
        await this.checkUserExist(user);

        const updateData = this.extractUpdatedFields(updateProfileDto);

        if (Object.keys(updateData).length === 0) {
            throw new BadRequestException("You must provide at least one field to update");
        }

        const updatedUser = await this.userRepository.updateOne(
            { _id: user._id },
            { $set: updateData },
        );

        if (!updatedUser) {
            throw new BadRequestException("Failed to update user profile");
        }

        return this.mapUserResponse(updatedUser);
    }

    public async getProfileUser(id: string | Types.ObjectId) {
        const userExist = await this.userRepository.getOne({
            _id: id,
            deletedAt: { $exists: false }
        });

        if (!userExist) {
            throw new NotFoundException("User not found");
        }

        return this.mapUserResponse(userExist);
    }

    public async updatePassword(passwordDto: UpdatePasswordDto, user: User) {
        const userExist = await this.checkUserExist(user);

        if (!compereHash(passwordDto.oldPassword, userExist.password)) {
            throw new UnauthorizedException("Old password is incorrect");
        }

        const password = await generatedHash(passwordDto.newPassword);

        await this.userRepository.updateOne(
            { _id: userExist._id },
            { $set: { password, changeCredentialTime: Date.now() } }
        );

        return { message: "Password updated successfully" };
    }

    public async deleteAccount(user: User) {
        await this.checkUserExist(user);

        await this.userRepository.softDeleteOne(user._id, {
            $set: { deletedAt: Date.now() }
        });

        return { message: "User deleted successfully" };
    }

    // =====================
    //   IMAGE UPLOAD/DELETE
    // =====================

    private async uploadUserImage(
        type: "profilePic" | "coverPic",
        file: Express.Multer.File,
        user: User
    ) {
        const userExist = await this.checkUserExist(user);

        const folder = type === "profilePic" ? "profile" : "cover";
        const currentImage = userExist[type];

        const uploaded = await this.cloudinaryService.uploadFile(
            file,
            `JobSearch/${userExist._id}/${folder}`,
            currentImage?.public_id
        );

        await this.userRepository.updateOne(
            { _id: userExist._id },
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

    private async deleteUserImage(type: "profilePic" | "coverPic", user: User) {
        const userExist = await this.checkUserExist(user);
        const image = userExist[type];

        if (!image) {
            throw new NotFoundException(`No ${type} found`);
        }

        const folder = type === "profilePic" ? "profile" : "cover";

        await this.cloudinaryService.deleteFile(
            `JobSearch/${userExist._id}/${folder}/${image.public_id}`
        );

        await this.userRepository.updateOne(
            { _id: userExist._id },
            { $unset: { [type]: 1 } }
        );

        return `${type} deleted successfully`;
    }
    //-----------------------
    public uploadImageProfile(file: Express.Multer.File, user: User) {
        return this.uploadUserImage("profilePic", file, user);
    }

    public uploadImageCover(file: Express.Multer.File, user: User) {
        return this.uploadUserImage("coverPic", file, user);
    }

    public deleteImageProfile(user: User) {
        return this.deleteUserImage("profilePic", user);
    }

    public deleteImageCover(user: User) {
        return this.deleteUserImage("coverPic", user);
    }
}

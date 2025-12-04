import { BadRequestException, Injectable } from "@nestjs/common";
import { Types } from "mongoose";
import { compereHash, generatedHash } from "src/common";
import { User, UserRepository } from "src/DB";
import { UpdatePasswordDto, UpdateProfileDto } from "./DTO";




@Injectable()
export class UserService {
    constructor(
        private readonly userRepository: UserRepository
    ) { }


    //update profile 
    private extractUpdatedFields(dto: UpdateProfileDto): Partial<User> {
        const updateData: Partial<User> = {};

        for (const key in dto) {
            if (dto[key] !== undefined && dto[key] !== null) {
                updateData[key] = dto[key];
            }
        }

        return updateData;
    }
    private async checkUserExist(user: User) {
        const userExist = await this.userRepository.getOne({ _id: user._id, deletedAt: { $exists: false } });
        if (!userExist) {
            throw new BadRequestException("User not found");
        }
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
            throw new Error("Failed to update user profile");
        }

        const response = {
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
            mobileNumber: updatedUser.mobileNumber,
            dob: updatedUser.dob,
            gender: updatedUser.gender
        };
        return response;

    }

    //work also with public anther 
    public async getProfileUser(id: string | Types.ObjectId) {
        const userExist = await this.userRepository.getOne({ _id: id, deletedAt: { $exists: false } });
        if (!userExist) {
            throw new BadRequestException("User not found");
        }
        const response = {
            firstName: userExist.firstName,
            lastName: userExist.lastName,
            mobileNumber: userExist.mobileNumber,
            dob: userExist.dob,
            gender: userExist.gender
        };
        return response;
    }
    public async updatePassword(passwordDto: UpdatePasswordDto, user: User) {
        await this.checkUserExist(user);
        //compere old password with user password
        if (!compereHash(passwordDto.oldPassword, user.password)) {
            throw new BadRequestException("Invalid credentials");
        }
        const password = await generatedHash(passwordDto.newPassword);
        const updatedUser = await this.userRepository.updateOne({ _id: user._id }, { $set: { password, changeCredentialTime: Date.now() } });
        if (!updatedUser) {
            throw new Error("Failed to update user password");
        }
        return;
    }
    public async deleteAccount(user: User) {
        await this.checkUserExist(user);
        const deletedUser = await this.userRepository.softDeleteOne(user._id, { $set: { deletedAt: Date.now() } });
        if (!deletedUser) {
            throw new Error("Failed to delete user account");
        }
        return;
    }

    //**
    // ToDo upload and delete pic porfile or cover */

}
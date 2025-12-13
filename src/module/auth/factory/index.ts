import { Injectable } from "@nestjs/common";
import { generatedHash, USER_PROVIDER } from "../../../common";
import { RegisterAuthDto } from "../dto";
import { User } from "../entities";
@Injectable()
export class AuthFactory {
    public async register(registerDto: RegisterAuthDto) {
        const user = new User();
        user.firstName = registerDto.firstName;
        user.lastName = registerDto.lastName;
        user.mobileNumber = registerDto.mobileNumber;
        user.email = registerDto.email;
        user.password = await generatedHash(registerDto.password);
        user.gneder = registerDto.gender;
        user.role = registerDto.role;
        user.dob = registerDto.dob;
        user.isConfirmed = false;
        user.updatedAt = new Date();
        user.provider = USER_PROVIDER.SYSTEM;
        return user;
    }
}
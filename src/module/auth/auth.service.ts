import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { compereHash } from "src/common";
import { UserDocument, UserRepository } from "src/DB";
import { User } from "./entities";

@Injectable()
export class AuthService {
    constructor(
        private readonly userRepository: UserRepository,
    ) { }


    public async register(user: User): Promise<{ userName: string, email: string, mobileNumber: string, role: string, dob: Date }> {
        //get user 
        const userExist = await this.userRepository.getOne({ email: user.email });
        //check user exsit?
        if (userExist) {
            throw new ConflictException('User already exist')
        }
        //create user
        const newUser = await this.userRepository.create(user as unknown as UserDocument);
        //return user
        const { userName, email, mobileNumber, role, dob } = newUser;
        return { userName, email, mobileNumber, role, dob };
    }
    public async confirmEmail(email: string, otp: string): Promise<string> {
        //find user
        const userExist = await this.userRepository.getOne({ email });

        if (!userExist) {
            throw new NotFoundException("Email not found");
        }

        //check is already confirmed
        if (userExist.isConfirmed) {
            throw new ConflictException("Account already confirmed");
        }

        //check otp array exists + has items
        const latestOtp = userExist.otp?.at(-1);
        if (!latestOtp || !latestOtp.code) {
            throw new BadRequestException("OTP not found");
        }
        if (!(latestOtp.type === 'confirmEmail')) {
            throw new BadRequestException("Invalid OTP type");
        }


        //check otp expired
        if (latestOtp.expiresIn < new Date()) {
            throw new ConflictException("OTP expired");
        }

        //compare otp
        const isMatch = await compereHash(otp, latestOtp.code);
        if (!isMatch) {
            throw new BadRequestException("Invalid OTP");
        }

        //update user confirm status
        userExist.isConfirmed = true;
        await userExist.save();

        return "Email confirmed successfully";
    }

}

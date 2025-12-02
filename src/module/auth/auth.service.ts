import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { compereHash, confirmEmailTemplate, generatedHash, generateExpiryTime, generateOtp, resetPasswordTemplate, sendEmailHelper, typeOtp } from "src/common";
import { UserDocument, UserRepository } from "src/DB";
import { User } from "./entities";
import { LoginDto } from "./dto";
import { ResetPasswordDto } from "./dto/reset_password-auth.dto";

@Injectable()
export class AuthService {
    constructor(
        private readonly userRepository: UserRepository,
    ) { }
    private async getUser(email: string) {
        return await this.userRepository.getOne({ email });
    }
    private async checkOtp(user, type: string, otp: string): Promise<void> {
        //check otp array exists + has items
        const latestOtp = user.otp?.at(-1);
        if (!latestOtp || !latestOtp.code) {
            throw new BadRequestException("OTP not found");
        }
        if (!(latestOtp.type === type)) {
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

    }

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
        const userExist = await this.getUser(email);

        if (!userExist) {
            throw new NotFoundException("Email not found");
        }

        //check is already confirmed
        if (userExist.isConfirmed) {
            throw new ConflictException("Account already confirmed");
        }
        await this.checkOtp(userExist, typeOtp.confirmEmail, otp)
        //update user confirm status
        userExist.isConfirmed = true;
        await userExist.save();

        return "Email confirmed successfully";
    }
    public async resendOtp(email: string): Promise<string> {
        console.log(`service in resend otp`)
        //check email
        const userExist = await this.getUser(email);

        if (!userExist) {
            throw new NotFoundException("Email not found");
        }

        //check otp is realy expired


        //check otp array exists + has items
        const latestOtp = userExist.otp?.at(-1);
        if (!latestOtp || !latestOtp.code) {
            throw new BadRequestException("OTP not found");
        }
        if (latestOtp.expiresIn > new Date()) {
            const min = Math.ceil(((latestOtp.expiresIn.getTime() - new Date().getTime()) / 1000) / 60);


            throw new ConflictException(`OTP isn't expired yet,will expire after ${min}min`);
        }
        const code = generateOtp();
        const expiresIn = generateExpiryTime();

        //if confirmed eamil otp for resetpassword
        //*where confirm eamil otp it in hooks pre🍵🍵
        if (userExist.isConfirmed) {
            userExist.otp.push({ code: await generatedHash(code), type: typeOtp.forgetPassword, expiresIn });
            await sendEmailHelper({
                to: email,
                subject: 'Confirm Your Email',
                html: resetPasswordTemplate(code),
            });

        }
        await userExist.save();
        return `done,sen new otp`;

    }
    public async resetPassword(resetPasswordDto: ResetPasswordDto) {
        const userExist = await this.getUser(resetPasswordDto.email);
        if (!userExist) {
            throw new NotFoundException("Email not found");
        }
        await this.checkOtp(userExist, typeOtp.forgetPassword, resetPasswordDto.otp);
        //update password
        userExist.password = await generatedHash(resetPasswordDto.password);
        await userExist.save();
        return `updated password successfully`;
    }
    public async login(loginDto: LoginDto) {
        const userExist = await this.getUser(loginDto.email);
        if (!userExist) {
            throw new BadRequestException("Invalid credentials");
        }
        //if user not confirmed
        if (!userExist.isConfirmed) {
            throw new ConflictException("Account is not confirmed");
        }
        //compere password
        const math = await compereHash(loginDto.password, userExist.password);
        if (!math) {
            throw new BadRequestException('Invalid credentials');
        }
        //todo genereta token
        return 'done login';
    }
}

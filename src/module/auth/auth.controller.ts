import { Body, Controller, Patch, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { ConfirmEmailDto, LoginDto, RegisterAuthDto, ResendOtpDto } from "./dto";
import { User } from "./entities";
import { AuthFactory } from "./factory";
import { ResetPasswordDto } from "./dto/reset_password-auth.dto";

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authFactoryService: AuthFactory,
        private readonly authService: AuthService,
    ) { }
    //logic

    @Post('register')
    public async register(@Body() registerDto: RegisterAuthDto) {
        const user: User = await this.authFactoryService.register(registerDto);
        const newUser = await this.authService.register(user)
        return {
            message: "created Account successfully ",
            success: true,
            data: newUser
        }
    }
    @Patch('confirm-email')
    public async confirmEmail(@Body() confirmEmailDto: ConfirmEmailDto) {
        const message = await this.authService.confirmEmail(confirmEmailDto.email, confirmEmailDto.otp)
        return {
            message,
            success: true,
        }
    }
    @Patch('resend-otp')
    public async resendOtp(@Body() resendOtpDto: ResendOtpDto) {
        const message = await this.authService.resendOtp(resendOtpDto.email)
        return {
            message,
            success: true,
        }
    }
    @Patch('reset-password')
    public async resetPassword(@Body() resetPassword: ResetPasswordDto) {
        const message = await this.authService.resetPassword(resetPassword)
        return {
            message,
            success: true,
        }

    }
    @Post('login')
    public async login(@Body() loginDto: LoginDto) {
        const message = await this.authService.login(loginDto);
        return {
            message,
            success: true,
        }
    }



}
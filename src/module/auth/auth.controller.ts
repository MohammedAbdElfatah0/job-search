import { BadRequestException, Body, Controller, Headers, Patch, Post, Put, UsePipes, ValidationPipe } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { ConfirmEmailDto, LoginDto, RegisterAuthDto, ResendOtpDto, ResetPasswordDto } from "./dto";
import { User } from "./entities";
import { AuthFactory } from "./factory";

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
            data: newUser
        }
    }
    @Patch('confirm-email')
    public async confirmEmail(@Body() confirmEmailDto: ConfirmEmailDto) {
        const message = await this.authService.confirmEmail(confirmEmailDto.email, confirmEmailDto.otp)
        return {
            message,
        }
    }
    @Patch('resend-otp')
    public async resendOtp(@Body() resendOtpDto: ResendOtpDto) {
        const message = await this.authService.resendOtp(resendOtpDto.email)
        return {
            message,
        }
    }
    @Patch('reset-password')
    public async resetPassword(@Body() resetPassword: ResetPasswordDto) {
        const message = await this.authService.resetPassword(resetPassword)
        return {
            message,
        }

    }
    @Post('login')
    public async login(@Body() loginDto: LoginDto) {
        const data = await this.authService.login(loginDto);
        return {
            message: "Login Successfully",
            data
        }
    }
    @Put('/refresh-token')
    public async refreshToken(@Headers('Authorization') authorization: string) {
        if (!authorization) {
            throw new BadRequestException("Authorization header is missing");
        }
        const { accessToken } = await this.authService.refreshToken(authorization);
        return {
            message: "token refreshed successfully",
            data: { accessToken }
        }

    }
    @Post('/google/login')
    public async googleLogin(@Body('idToken') idToken: string) {
        if (!idToken) {
            throw new BadRequestException('id token is required')
        }
        const { accessToken, refreshToken } = await this.authService.googleLogin(idToken);
        return {
            message: "login with google successfully",
            data: { accessToken, refreshToken }
        }
    }
    @Patch('logout')
    @UsePipes(new ValidationPipe({ validateCustomDecorators: true }))
    public async logout(@Headers('Authorization') authorization: string) {
        if (!authorization) {
            throw new BadRequestException("Authorization header is missing");
        }


        const message = await this.authService.logout(authorization);
        return {
            message
        };
    }



}
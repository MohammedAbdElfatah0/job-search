import { Body, Controller, Patch, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { ConfirmEmailDto, RegisterAuthDto } from "./dto";
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


}
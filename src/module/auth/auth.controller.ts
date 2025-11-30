import { Body, Controller, Post } from "@nestjs/common";
import { RegisterAuthDto } from "./dto/register-auth.dto";

@Controller('auth')
export class AuthController {
    constructor(
        private readonly 
    ) { }
    //logic

    @Post('register')
    register(@Body() registerDto: RegisterAuthDto) {

     }
}
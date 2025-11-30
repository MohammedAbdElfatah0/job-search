import { Controller, Post } from "@nestjs/common";

@Controller('auth')
export class AuthController {
    constructor() { }
    //logic

    @Post('register')
    register(){}
}
import { Controller, Get } from "@nestjs/common";
@Controller()
export class AppController {
    constructor() { }
    @Get('')
    helloWord() {
        return { message: 'Hello World' };
    }
}
import { Controller, Get } from "@nestjs/common";
@Controller()
class AppController {
    constructor() { }
    @Get('')
    helloWord() {
        return { message: 'Hello World' };
    }
}
import { Module } from "@nestjs/common";
import { RealTimeGateway } from "./gateway";

@Module({
    providers:[RealTimeGateway],
    exports:[],

})
export class RealTimeModule { }
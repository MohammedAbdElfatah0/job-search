import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Chat, ChatRepository, ChatSchema, CompanyRepository, Compeny, CompenySchema } from "../../DB";
import { RealTimeGateway } from "./gateway";

@Module({
    imports: [
        MongooseModule.forFeature(
            [{ name: Compeny.name, schema: CompenySchema },
            { name: Chat.name, schema: ChatSchema }
            ]
        )
    ],
    providers: [RealTimeGateway, CompanyRepository, ChatRepository],
    exports: [],

})
export class RealTimeModule { }
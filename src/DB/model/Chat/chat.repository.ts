import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Chat, ChatDocument } from "./chat.schema";
import { AbstractRepository } from "../../repository";
@Injectable()
export class ChatRepository extends AbstractRepository<ChatDocument> {
    constructor(
        @InjectModel(Chat.name) private readonly chatModel: Model<ChatDocument>,
    ) {
        super(chatModel);
    }


}

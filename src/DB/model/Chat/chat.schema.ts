import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema({ timestamps: true })
export class Chat {

    // 1. Sender Id (HR or company owner)
    @Prop({ type: Types.ObjectId, ref: "User", required: true })
    senderId: Types.ObjectId;

    // 2. Receiver Id (any user)
    @Prop({ type: Types.ObjectId, ref: "User", required: true })
    receiverId: Types.ObjectId;

    // 3. Messages array
    @Prop({
        type: [
            {
                message: { type: String, required: true },
                senderId: { type: Types.ObjectId, ref: "User", required: true },
                createdAt: { type: Date, default: Date.now },
            }
        ],
        default: [],
    })
    messages: {
        message: string;
        senderId: Types.ObjectId;
        createdAt?: Date;
    }[];
}

export type ChatDocument = Chat & Document;
export const ChatSchema = SchemaFactory.createForClass(Chat);

// Model export
export const ChatModel = MongooseModule.forFeature([
    { name: Chat.name, schema: ChatSchema },
]);

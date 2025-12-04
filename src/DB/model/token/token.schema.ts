
import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";


@Schema({ timestamps: true })
export class Token {

    //userId
    @Prop({ type: Types.ObjectId, ref: "User", required: true })
    userId: Types.ObjectId;
    //token - refresh token
    @Prop({ type: String, required: true })
    token: string;
    //isRevoked
    @Prop({ type: Boolean, default: false })
    isRevoked: boolean;
    //expirydate
    @Prop({ type: Date, required: true })
    expiryDate: Date;
    createdAt: Date;

}
export const tokenSchema = SchemaFactory.createForClass(Token);
tokenSchema.index({ expiryDate: 1 }, { expireAfterSeconds: 0 });
export const tokenModel = MongooseModule.forFeature([{ name: Token.name, schema: tokenSchema }]);
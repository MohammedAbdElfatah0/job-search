import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Token, TokenDocument } from "./token.schema";
import { AbstractRepository } from "src/DB/repository";
@Injectable()
export class TokenRepository extends AbstractRepository<TokenDocument> {
    constructor(
        @InjectModel(Token.name) private readonly token: Model<TokenDocument>,
    ) {
        super(token);
    }

    revoke(token: string) {
        return this.token.updateOne({ token }, { isRevoked: true });
    }
}

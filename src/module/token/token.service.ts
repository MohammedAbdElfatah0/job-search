import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Types } from 'mongoose';
// import { TokenRepository, User } from 'src/DB/model';
import { typeToken } from '../../common/utils/enum';
import { TokenRepository } from 'src/DB/model/token/token.repository';
import { User } from 'src/DB';


@Injectable()
export class TokenService {
    constructor(
        private readonly tokenRepo: TokenRepository,
        private readonly jwtService: JwtService,
        private readonly config: ConfigService,
    ) { }

    generateAccessToken(payload: Partial<User>) {
        return this.jwtService.sign(payload, {
            secret: this.config.get('token').access,
            expiresIn: '15m',
        });
    }
    //with saving in DB
    async generateRefreshToken(userId: Types.ObjectId, payload: Partial<User>) {
        const token = this.jwtService.sign(payload, {
            secret: this.config.get('token').refresh,
            expiresIn: '7d',
        });

        await this.tokenRepo.create({
            userId,
            token,
            expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });

        return token;
    }

 
    verifyToken(token: string, type: typeToken) {
        const secret =
            type === typeToken.access
                ? this.config.get('token').access
                : this.config.get('token').refresh;

        return this.jwtService.verify(token, { secret });
    }


    decode(token: string) {
        return this.jwtService.decode(token);
    }

    async revokeRefreshToken(token: string) {
        await this.tokenRepo.revoke(token);
        return true;
    }
}



import { BadRequestException, CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { TokenRepository, UserRepository } from 'src/DB/model/index';
import { TokenService } from 'src/module/token';
import { PUBLIC } from '../decorator';
import { typeToken } from '../utils';
@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly userRepo: UserRepository,
        private readonly reflector: Reflector,
        private readonly tokenService: TokenService,
        private readonly repoToken: TokenRepository,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        // public
        const isPublic = this.reflector.get(PUBLIC, context.getHandler());
        if (isPublic) return true;
        //todo :give refreshtoken for check changeCredentialsTime
        /**
         * get one refresh token and get one user compere time createdAt and changeCredentialsTime
         * if changeCredentialsTime > createdAt expireToken
         * make in doc revoke Token
         */
        // get token
        const { authorization, refreshToken }: { authorization: string, refreshToken: string } = request.headers;
        if (!authorization && !refreshToken) {
            throw new BadRequestException("authorization is required");
        }

        const token = authorization.replace("Bearer ", "");

        let data, refToken;

        try {
            // verify ACCESS Token
            data = this.tokenService.verifyToken(token, typeToken.access);
            refToken = this.tokenService.verifyToken(refreshToken, typeToken.refresh);

        } catch (err) {
            if (err.name === 'TokenExpiredError') {
                throw new UnauthorizedException("ACCESS_TOKEN_EXPIRED");
            }

            throw new UnauthorizedException("INVALID_ACCESS_TOKEN");
        }
        const refTokenDoc = await this.repoToken.getOne({ token: refToken });
        if (!refTokenDoc) throw new UnauthorizedException("Invalid Refresh Token");
        // verify user exists
        const user = await this.userRepo.getOne({ _id: data._id });
        if (!user) throw new UnauthorizedException("user not found");
        //compere date
        if (user.changeCredentialTime > refTokenDoc.createdAt) throw new UnauthorizedException("Invalid Refresh Token");
        

        request.user = user;
        return true;
    }
}

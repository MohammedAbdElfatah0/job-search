

import { BadRequestException, CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { TokenRepository} from "src/DB/model/token/token.repository"
import { TokenService } from 'src/module/token/token.service';
import { PUBLIC } from '../decorator';
import { typeToken } from '../utils';
import { UserRepository } from 'src/DB/model/user/user.repository';
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
        // get token
        const { authorization, refreshtoken }: { authorization: string, refreshtoken: string } = request.headers;
        if (!authorization && !refreshtoken) {
            throw new BadRequestException("authorization is required");
        }


        const token = authorization.replace("Bearer ", "");

        let data, refToken;

        try {
            // verify ACCESS Token
            data = this.tokenService.verifyToken(token, typeToken.access);
            refToken = this.tokenService.verifyToken(refreshtoken, typeToken.refresh);

        } catch (err) {
            if (err.name === 'TokenExpiredError') {
                throw new UnauthorizedException("ACCESS_TOKEN_EXPIRED");
            }
            if (err.name === 'JsonWebTokenError') {
                throw new UnauthorizedException("INVALID_ACCESS_TOKEN_");
            }

            throw new UnauthorizedException("INVALID_ACCESS_TOKEN");
        }
        console.log({ data, refToken })
        const refTokenDoc = await this.repoToken.getOne({ token: refreshtoken });
        if (!refTokenDoc) throw new UnauthorizedException("Invalid Refresh Token");
        // verify user exists
        const user = await this.userRepo.getOne({ email: data.email });
        if (!user) throw new UnauthorizedException("user not found");
        //compere date
        if (user.changeCredentialTime > refTokenDoc.createdAt) throw new UnauthorizedException("Invalid Refresh Token");


        request.user = user;
        return true;
    }
}

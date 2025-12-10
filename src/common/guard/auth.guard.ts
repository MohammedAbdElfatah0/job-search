

import { BadRequestException, CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { TokenRepository } from "src/DB/model/token/token.repository"
import { TokenService } from 'src/module/token/token.service';
import { PUBLIC } from '../decorator';
import { typeToken } from '../utils';
import { UserRepository } from 'src/DB/model/user/user.repository';
import { GqlExecutionContext } from '@nestjs/graphql';
@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly userRepo: UserRepository,
        private readonly reflector: Reflector,
        private readonly tokenService: TokenService,
        private readonly repoToken: TokenRepository,
    ) { }
    private giveHeader(req: any) {
        const { headers } = req;
        const authorization = headers.authorization;
        const refreshtoken = headers.refreshtoken;
        return { authorization, refreshtoken };
    }
    async canActivate(context: ExecutionContext): Promise<boolean> {


        // public
        const isPublic = this.reflector.get(PUBLIC, context.getHandler());
        if (isPublic) return true;
        // get token
        let req;
        let authorization: string = "";
        let refreshtoken: string = "";
        switch (context.getType<string>()) {
            case "http":
                req = context.switchToHttp().getRequest();
                ({ authorization, refreshtoken } = this.giveHeader(req));
                break;
            case "graphql":
                req = GqlExecutionContext.create(context).getContext().req;
                ({ authorization, refreshtoken } = this.giveHeader(req));
                break;
            case "ws":
                req = context.switchToWs().getClient();
                ({ authorization, refreshtoken } = this.giveHeader(req));
                break;
        }

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

        console.log(user);
        req.user = user;
        return true;
    }
}

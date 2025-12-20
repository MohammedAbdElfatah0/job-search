

import { CanActivate, ExecutionContext, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { WsException } from '@nestjs/websockets';
import { TokenRepository } from "../../DB/model/token/token.repository";
import { UserRepository } from '../../DB/model/user/user.repository';
import { TokenService } from '../../module/token/token.service';
import { PUBLIC } from '../decorator';
import { typeToken } from '../utils';
import { socketIOAuthorization } from '../utils/socket.io.authorization';
@Injectable()
export class AuthGuard implements CanActivate {
    private throwErrorAuthorized(
        contextType: string,
        message: string,
    ) {
        if (contextType === 'ws') {
            throw new WsException(message);
        }
        throw new UnauthorizedException(message);
    }
    private throwErrorNotFound(
        contextType: string,
        message: string,
    ) {
        if (contextType === 'ws') {
            throw new WsException(message);
        }
        throw new NotFoundException(message);
    }


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
                const socketAuth = socketIOAuthorization(req);
                authorization = (typeof socketAuth.authorization === 'string' ? socketAuth.authorization : '') || '';
                refreshtoken = (typeof socketAuth.refreshtoken === 'string' ? socketAuth.refreshtoken : '') || '';
                break;
        }

        if (!authorization && !refreshtoken) {
            this.throwErrorAuthorized(context.getType<string>(), "authorization and refreshToken are required");

        }


        const token = authorization.replace("Bearer ", "");

        let accessToken: any, refToken: string;
        //-- Access Token verify
        try {
            accessToken = this.tokenService.verifyToken(token, typeToken.access);
        } catch (err) {
            if (err.name === 'TokenExpiredError') {
                this.throwErrorAuthorized(context.getType<string>(), 'ACCESS_TOKEN_EXPIRED');
            }
            this.throwErrorAuthorized(context.getType<string>(), 'INVALID_ACCESS_TOKEN');
        }
        //-----refresh Token verify
        try {
            refToken = this.tokenService.verifyToken(refreshtoken, typeToken.refresh);
        } catch (err) {
            this.throwErrorAuthorized(context.getType<string>(), 'INVALID_REFRESH_TOKEN');
        }


        const refreshTokenExist = await this.repoToken.getOne({ token: refreshtoken });
        if (!refreshTokenExist)
            this.throwErrorAuthorized(context.getType<string>(), "Invalid Refresh Token");

        // verify user exists
        const user = await this.userRepo.getOne({ email: accessToken.email   });
        if (!user)
            this.throwErrorNotFound(context.getType<string>(), "user not found");

        //compere date
        if (user!.changeCredentialTime > refreshTokenExist!.createdAt)
            this.throwErrorAuthorized(context.getType<string>(), "Invalid Refresh Token");


        console.log(user);
        req.user = user;
        return true;
    }
}

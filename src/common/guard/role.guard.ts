
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { PUBLIC, Roles } from "../decorator";
import { GqlExecutionContext } from "@nestjs/graphql";
// import { request } from 'supertest';

@Injectable()
export class RolesGuards implements CanActivate {

    constructor(
        private readonly reflector: Reflector
    ) {

    }

    canActivate(context: ExecutionContext): boolean {
        let request: any;
        const roles = this.reflector.getAllAndMerge(Roles, [context.getHandler(), context.getClass()])
        const Public = this.reflector.get(PUBLIC, context.getHandler());
        if (Public) return true;
        switch (context.getType<string>()) {
            case "http":
                request = context.switchToHttp().getRequest();
                break;
            case "graphql":
                request = GqlExecutionContext.create(context).getContext().req;

                break;
            case "ws":
                request = context.switchToWs().getClient();
                break;
        }
        if (!roles.includes(request.user.role)) throw new UnauthorizedException("you are Not Allow");
        return true;
    }

}
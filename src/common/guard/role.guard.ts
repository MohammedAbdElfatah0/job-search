
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { PUBLIC, Roles } from "../decorator";
// import { request } from 'supertest';

@Injectable()
export class RolesGuards implements CanActivate {

    constructor(
        private readonly reflector: Reflector
    ) {

    }

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const roles = this.reflector.getAllAndMerge(Roles, [context.getHandler(), context.getClass()])
        const Public = this.reflector.get(PUBLIC, context.getHandler());
        if (Public) return true;
        if (!roles.includes(request.user.role)) throw new UnauthorizedException("you are Not Allow");
        return true;
    }

}
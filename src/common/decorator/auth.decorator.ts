import { applyDecorators, UseGuards } from "@nestjs/common"
import { Roles } from "./roles.decorator"
import { AuthGuard, RolesGuards } from "../guard"



export const Auth = (roles: string[]) => {
    return applyDecorators(
        Roles(roles),
        UseGuards(AuthGuard, RolesGuards)
    )
}
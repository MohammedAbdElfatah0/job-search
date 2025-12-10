import { ThrottlerGuard } from "@nestjs/throttler";
import { ExecutionContext, Injectable } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";

@Injectable()
export class GqlThrottlerGuard extends ThrottlerGuard {
    getRequestResponse(context: ExecutionContext) {
        const ctxType = context.getType<string>();

        // Handle GraphQL requests
        if (ctxType === "graphql") {
            const gqlCtx = GqlExecutionContext.create(context);
            const { req, res } = gqlCtx.getContext<{
                req: Record<string, any>;
                res: Record<string, any>;
            }>();

            return { req, res };
        }

        // Fallback to default behavior for HTTP/REST and other contexts
        return super.getRequestResponse(context);
    }
}

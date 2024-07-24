import { ExecutionContext, Injectable } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { AuthGuard } from "@nestjs/passport";

/// Refresh token guard
@Injectable()
export class RtGuard extends AuthGuard('rt-jwt') {

    getRequest(context: ExecutionContext) {
        const ctx = GqlExecutionContext.create(context);

        return ctx.getContext().req;
    }
}
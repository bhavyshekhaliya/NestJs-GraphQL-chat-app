import { ExecutionContext, Injectable } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { AuthGuard } from "@nestjs/passport";

/// AccessToken guard
@Injectable()
export class AtGuard extends AuthGuard('at-jwt') {

    getRequest(context: ExecutionContext) {
        const ctx = GqlExecutionContext.create(context);
        
        return ctx.getContext().req;
    }
}
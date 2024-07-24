import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class Tokens {
    
    @Field(() => String)
    accessToken: string;

    @Field(() => String)
    refreshToken: string;
}

export interface TokenPayload {
    _id: string,
    email: string,
};


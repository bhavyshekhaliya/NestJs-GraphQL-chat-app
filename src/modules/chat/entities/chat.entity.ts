import { Field, ObjectType } from "@nestjs/graphql";
import { AbstractSchema } from "src/common/database/abstract.schema";

@ObjectType()
export class Chat extends AbstractSchema {
    
    @Field()
    userId: string

    @Field()
    isPrivate: boolean

    // list of userIds to invite
    @Field(() => [String])
    userIds: string[]

    @Field({ nullable: true })
    name?: string   
}
import { Field, ObjectType } from "@nestjs/graphql";
import { AbstractSchema } from "src/common/database/abstract.schema";
import { DateScalar } from "src/common/scalars/date.scalars";
import { User } from "src/modules/user/entities/user.entity";

@ObjectType()
export class Message extends AbstractSchema {
    
    @Field(() => String)
    content: string
    
    @Field(() => User)
    user: User

    @Field()
    chatId: string

    @Field(() => DateScalar)
    createdAt: Date
}
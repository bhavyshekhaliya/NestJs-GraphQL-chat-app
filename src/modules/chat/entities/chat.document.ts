import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { AbstractSchema } from "src/common/database/abstract.schema";
import { MessageDocument } from "../message/entities/message.document";

@Schema({ timestamps: true })
export class ChatDocument extends AbstractSchema {

    @Prop()
    userId: string

    @Prop()
    name: string

    @Prop([MessageDocument])
    messages: MessageDocument[]
}

export const ChatSchema = SchemaFactory.createForClass(ChatDocument);
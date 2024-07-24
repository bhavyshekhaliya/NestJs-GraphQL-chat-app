import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { AbstractSchema } from "src/common/database/abstract.schema";

@Schema({ timestamps: true })
export class MessageDocument extends AbstractSchema {

    @Prop()
    content: string
    
    @Prop()
    userId: Types.ObjectId

    @Prop()
    createdAt: Date
}

export const MessageSchema = SchemaFactory.createForClass(MessageDocument);


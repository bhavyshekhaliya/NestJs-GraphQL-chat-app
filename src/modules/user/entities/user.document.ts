import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { AbstractSchema } from "src/common/database/abstract.schema";

@Schema({ versionKey: false, timestamps: true })
export class UserDocument extends AbstractSchema {

    @Prop({ unique: true })
    email: string

    @Prop()
    password: string

    @Prop({ default: null })
    refreshToken: string
}

export const UserSchema = SchemaFactory.createForClass(UserDocument);
import { ArgsType, Field } from "@nestjs/graphql";
import { Transform, Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsMongoId, IsNotEmpty, IsString } from "class-validator";

@ArgsType()
export class MessageCreatedDto {

    @Field(() => [String])
    @IsArray()
    @ArrayMinSize(1)
    @IsNotEmpty({ each: true })
    @IsString({ each: true })
    @IsMongoId({ each: true })
    @Transform(({ value }) => value.map((v: string) => v.trim()))
    @Type(() => String)
    chatIds: string[]
}
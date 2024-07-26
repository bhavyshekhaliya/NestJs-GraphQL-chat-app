import { ArgsType, Field } from "@nestjs/graphql";
import { Transform } from "class-transformer";
import { IsMongoId, IsNotEmpty, IsString } from "class-validator";
import { PaginationDto } from "src/common/dto/common.dto";

@ArgsType()
export class GetMessagesDto extends PaginationDto {

    @Field()
    @IsNotEmpty()
    @IsString()
    @IsMongoId()
    @Transform(({ value }) => value.trim())
    chatId: string
}
import { ArgsType, Field, Int } from "@nestjs/graphql";

@ArgsType()
export class PaginationDto {

    @Field(() => Int)
    skip: number;

    @Field(() => Int)
    limit: number;
}
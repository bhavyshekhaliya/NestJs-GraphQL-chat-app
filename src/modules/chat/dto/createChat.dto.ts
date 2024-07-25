import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty, IsString } from "class-validator";

@InputType() 
export class CreateChatDto {

  @Field()
  @IsNotEmpty()
  @IsString()
  name: string;
}
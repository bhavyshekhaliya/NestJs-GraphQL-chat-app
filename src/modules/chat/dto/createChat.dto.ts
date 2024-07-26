import { Field, InputType } from "@nestjs/graphql";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

@InputType() 
export class CreateChatDto {

  @Field()
  @IsNotEmpty({ message: "Chat name cannot be empty" })
  @IsString({ message: "Chat name must be a string" })
  @MinLength(2, { message: "Chat name must be at least 2 characters long" })
  @MaxLength(50, { message: "Chat name cannot exceed 50 characters" })
  @Transform(({ value }) => value.trim())
  name: string;
}
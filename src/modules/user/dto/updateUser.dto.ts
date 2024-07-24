import { InputType, PartialType } from '@nestjs/graphql';
import { CreateUserDto } from './createUser.dto';

@InputType()
export class UpdateUserDto extends PartialType(CreateUserDto) {}

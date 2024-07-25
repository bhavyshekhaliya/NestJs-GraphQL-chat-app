import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { UseGuards } from '@nestjs/common';
import { AtGuard } from '../auth/guards/at.guard';
import { CurrentUser } from 'src/common/decorators/currectUser.decorator';
import { TokenPayload } from 'src/common/types/common.type';
import { UpdateUserDto } from './dto/updateUser.dto';

@Resolver()
export class UserResolver {

    constructor(
        private readonly userService: UserService
    ) { }

    @Query(() => [User], { name: 'users' })
    @UseGuards(AtGuard)
    async findAll(): Promise<User[]> {
        return this.userService.findAll();
    }

    @Query(() => User, { name: 'user' })
    @UseGuards(AtGuard)
    async findOne(@Args('_id') _id: string): Promise<User> {
        return this.userService.findOne(_id);
    }

    @Mutation(() => User)
    @UseGuards(AtGuard)
    async updateUser(
        @Args('updateUserInput') updateUserDto: UpdateUserDto,
        @CurrentUser() user: TokenPayload,
    ): Promise<User> {
        return this.userService.update(user._id, updateUserDto);
    }

    @Mutation(() => User)
    @UseGuards(AtGuard)
    async removeUser(@CurrentUser() user: TokenPayload): Promise<User> {
        return this.userService.remove(user._id);
    }
}

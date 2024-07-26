import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ChatService } from './chat.service';
import { Chat } from './entities/chat.entity';
import { CreateChatDto } from './dto/createChat.dto';
import { CurrentUser } from 'src/common/decorators/currectUser.decorator';
import { TokenPayload } from 'src/common/types/common.type';
import { PaginationDto } from 'src/common/dto/common.dto';
import { UseGuards } from '@nestjs/common';
import { AtGuard } from '../auth/guards/at.guard';

@Resolver(() => Chat)
export class ChatResolver {

    constructor(
        private readonly chatService: ChatService
    ) { }

    // create chat
    @Mutation(() => Chat)
    @UseGuards(AtGuard)
    async createChat(
        @Args('createChatDto') createChatDto: CreateChatDto,
        @CurrentUser() user: TokenPayload
    ) {
        return this.chatService.createChat(createChatDto, user._id);
    }

    // findAll chats
    @Query(() => [Chat], { name: 'chats' })
    @UseGuards(AtGuard)
    async findAllChats(@Args() paginationDto: PaginationDto) {
        return this.chatService.findMany([], paginationDto)
    }

    // find chat
    @Query(() => Chat, { name: 'chat' })
    @UseGuards(AtGuard)
    async findOne(@Args('_id') _id: string) {
        return this.chatService.findOne(_id);
    }
}

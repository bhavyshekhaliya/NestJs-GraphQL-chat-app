import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { MessageService } from './message.service';
import { Message } from './entities/message.entity';
import { AtGuard } from 'src/modules/auth/guards/at.guard';
import { UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/common/decorators/currectUser.decorator';
import { TokenPayload } from 'src/common/types/common.type';
import { CreateMessageDto } from './dto/createMessage.dto';
import { GetMessagesDto } from './dto/getMessages.dto';
import { MessageCreatedDto } from './dto/messageCreated.dto';

@Resolver()
export class MessageResolver {
    constructor(private readonly messageService: MessageService) { }

    // Create message
    @Mutation(() => Message)
    @UseGuards(AtGuard)
    async createMessage(
        @Args('createMessageDto') createMessageDto: CreateMessageDto,
        @CurrentUser() user: TokenPayload,
    ): Promise<Message> {
        return this.messageService.createMessage(createMessageDto, user._id);
    }

    // Get messages
    @Query(() => [Message], { name: 'messages' })
    @UseGuards(AtGuard)
    async getMessages(
        @Args() getMessageArgs: GetMessagesDto,
    ): Promise<Message[]> {
        return this.messageService.getMessages(getMessageArgs);
    }

    // subscription for realtime listening
    @Subscription(() => Message)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async messageCreated(@Args() messageCreatedArgs: MessageCreatedDto) {
        return this.messageService.messageCreated();
    }
}

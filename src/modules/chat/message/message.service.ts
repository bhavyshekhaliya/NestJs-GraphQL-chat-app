import { Inject, Injectable } from '@nestjs/common';
import { ChatRepository } from '../chat.repository';
import { UserService } from 'src/modules/user/user.service';
import { MESSAGE_CREATED, PUB_SUB } from 'src/common/constants/constants';
import { PubSub } from 'graphql-subscriptions';
import { Types } from 'mongoose';
import { CreateMessageDto } from './dto/createMessage.dto';
import { MessageDocument } from './entities/message.document';
import { Message } from './entities/message.entity';
import { GetMessagesDto } from './dto/getMessages.dto';

@Injectable()
export class MessageService {

    constructor(
        private readonly chatRepository: ChatRepository,
        private readonly userService: UserService,
        @Inject(PUB_SUB) private readonly pubSub: PubSub
    ) { }

    // create message
    async createMessage({ content, chatId }: CreateMessageDto, userId: string) {
        const messageDocument: MessageDocument = {
            content,
            createdAt: new Date(),
            userId: new Types.ObjectId(userId),
            _id: new Types.ObjectId(),
        }

        // we are using findOneAndUpdate instead of create so that we can avoid multiple calls to the database to check the userId logics. findOneAndUpdate allows us to add the logic in a single call in the filter query.
        await this.chatRepository.findOneAndUpdate(
            {
                _id: chatId
            },
            {
                $push: {
                    messages: messageDocument
                }
            }
        );

        // create message entity using the messageDocument
        const message: Message = {
            ...messageDocument,
            chatId,
            user: await this.userService.findOne(userId),
        }

        // publish the message to the chatId channel
        await this.pubSub.publish(MESSAGE_CREATED, {
            messageCreated: message
        });

        return message;
    }

    // count messages
    async countMessages(chatId: string) {
        return (
            await this.chatRepository.model.aggregate([
                {
                    // $match operator is used to filter the documents by the chatId
                    $match: {
                        _id: new Types.ObjectId(chatId),
                    },
                },
                // $unwind operator is used to deconstruct an array field from the input documents to output a document for each element.
                { $unwind: '$messages' },

                // $count operator is used to return the count of the documents
                { $count: 'messages' },
            ])
        )[0];
    }

    // get limited messages with pagination
    async getMessages({ chatId, skip, limit } : GetMessagesDto) {
        const messages = await this.chatRepository.model.aggregate([
            {
                // $match operator is used to filter the documents
                $match: {
                    _id: new Types.ObjectId(chatId)
                },
            },
            // $unwind operator is used to deconstruct an array field from the input documents to output a document for each element. 
            {
                $unwind: '$messages',
            },
            // $replaceRoot operator is used to remove all the fields of the input document and replace them with the specified fields.
            {
                $replaceRoot: {
                    newRoot: '$messages'
                }
            },
            { $skip: skip },
            { $limit: limit },
            {
                $sort: { createdAt: -1 },
            },
            // $lookup operator is used to perform a left outer join to another collection in the same database to filter in documents from the "joined" collection for processing.
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user'
                },
            },
            {
                $unwind: '$user',
            },
            // $project operator is used to select the fields to include or exclude in the output document.
            {
                $unset: 'userId',
            },
            {
                $set: { chatId },
            },
        ]);
        for (const message of messages) {
            message.user = this.userService.toEntity(message.user);
        }

        return messages;
    }

    // it listing realTime created messages
    async messageCreated() {
        // MESSAGE_CREATED is the trigger that will be used to notify the client
        return this.pubSub.asyncIterator(MESSAGE_CREATED);
    }
}

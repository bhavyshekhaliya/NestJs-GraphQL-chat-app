import { Injectable, NotFoundException } from '@nestjs/common';
import { ChatRepository } from './chat.repository';
import { UserService } from '../user/user.service';
import { CreateChatDto } from './dto/createChat.dto';
import { PipelineStage, Types } from 'mongoose';
import { PaginationDto } from 'src/common/dto/common.dto';

@Injectable()
export class ChatService {

    constructor(
        private readonly chatRepository: ChatRepository,
        private readonly userService: UserService
    ) { }

    // Create chat
    async createChat(createChatDto: CreateChatDto, userId: string) {
        return this.chatRepository.create({
            ...createChatDto,
            userId,
            // userIds: createChatInput.userIds || [],
            messages: []
        });
    }

    // Count chats
    async countChats() {
        return await this.chatRepository.model.countDocuments({});
    }

    // find chats
    async findMany(
        prePipelineStages: PipelineStage[] = [],
        paginationDto?: PaginationDto
    ) {
        const chats = await this.chatRepository.model.aggregate([
            ...prePipelineStages,
            {
                $set: {
                    latestMessage: {
                        // conditional operator to check if messages is empty and return an object with createdAt field or the last message from messages
                        $cond: [
                            '$messages',
                            { $arrayElemAt: ['$messages', - 1] },
                            { createdAt: new Date() },
                        ],
                    },
                },
            },
            // sort the chat using messages creation time to avoid skewed results
            { $sort: { 'latestMessage.createdAt': -1 } },

            // assign pagination
            { $skip: paginationDto.skip },
            { $limit: paginationDto.limit },

            // remove messages as it can get very large and consume a lot of memory
            { $unset: 'messages' },

            {
                $lookup: {
                    from: 'users',
                    localField: 'latestMessage.userId',
                    foreignField: '_id',
                    // this will return an array with one element
                    as: 'latestMessage.user',
                }
            },
        ]);
        // clean ups
        chats.forEach((chat) => {
            if(!chat.latestMessage._id) {
                delete chat.latestMessage;
                return;
            }
            // latestMessage.user is an array with one element
            chat.latestMessage.user = this.userService.toEntity(
                chat.latestMessage.user[0]
            );
            delete chat.latestMessage.userId;
            chat.latestMessage.chatId = chat._id
        });
        return chats;
    }

    // find chat
    async findOne(_id: string) {
        const chats = await this.findMany([
            { $match: { chatId: new Types.ObjectId(_id) } },
        ]);
        if (!chats[0]) {
            throw new NotFoundException(`No chat was found with ID ${_id}`);
        }
        return chats[0];
    }
}

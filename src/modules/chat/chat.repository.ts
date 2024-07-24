import { Injectable, Logger } from "@nestjs/common";
import { Chat } from "./entities/chat.entity";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { MongoRespository } from "src/common/database/mongo.repository";

@Injectable()
export class ChatRepository extends MongoRespository<Chat>{
    protected readonly logger = new Logger(ChatRepository.name);

    constructor(@InjectModel(Chat.name) chatModel: Model<Chat>) {
        super(chatModel);
    }
}
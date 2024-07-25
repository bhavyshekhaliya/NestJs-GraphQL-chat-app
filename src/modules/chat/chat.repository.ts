import { Injectable, Logger } from "@nestjs/common";
import { Chat } from "./entities/chat.entity";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { MongoRespository } from "src/common/database/mongo.repository";
import { ChatDocument } from "./entities/chat.document";

@Injectable()
export class ChatRepository extends MongoRespository<ChatDocument>{
    protected readonly logger = new Logger(ChatRepository.name);

    constructor(@InjectModel(Chat.name) chatModel: Model<ChatDocument>) {
        super(chatModel);
    }
}
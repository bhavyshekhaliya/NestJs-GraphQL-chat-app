import { Injectable, Logger } from "@nestjs/common";
import { MongoRespository } from "src/common/database/mongo.repository";
import { User } from "./entities/user.entity";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { UserDocument } from "./entities/user.document";

@Injectable()
export class UserRepository extends MongoRespository<UserDocument> {
    protected readonly logger = new Logger(UserRepository.name);

    constructor(@InjectModel(User.name) userModel: Model<UserDocument>) {
        super(userModel);
    }     
}
import { Logger, NotFoundException } from "@nestjs/common";
import { AbstractSchema } from "./abstract.schema";
import { FilterQuery, Model, Types, UpdateQuery } from "mongoose";

export abstract class MongoRespository<T extends AbstractSchema> {

    protected abstract readonly logger: Logger;

    constructor(public   readonly model: Model<T>) { }

    /// create 
    async create(document: Partial<Omit<T, '_id'>>): Promise<T> {
        const createDocument = new this.model({
            ...document,
            _id: new Types.ObjectId(),
        });
        
        return (await createDocument.save()).toJSON() as unknown as T;
    }

    /// find
    async find(filterQuery: FilterQuery<T>): Promise<T[]> {
        return (await this.model.find(
            filterQuery, 
            // {} is used to define the projection. In this case, we are not using any projection. A projection is used to select only the necessary fields from the document.
            {}, 
            { lean: true })
        ) as unknown as T[];
    }

    /// findOne
    async findOne(filterQuery: FilterQuery<T>): Promise<T> {
        const document = await this.model.findOne(filterQuery, {}, { lean: true });

        return document as unknown as T;
    }

    /// findOneAndUpdate
    async findOneAndUpdate(
        filterQuery: FilterQuery<T>,
        update: UpdateQuery<T>
    ): Promise<T> {
        const document = await this.model.findOneAndUpdate(filterQuery, update, {
            // lean option is used to return a plain JavaScript object rather than a Mongoose document
            lean: true,
            // new option is used to return the modified document rather than the original
            new: true
        });

        if (!document) {
            this.logger.warn('Document not found with filterQuery: %o', filterQuery);
            throw new NotFoundException('Document not found');
        }

        return document as unknown as T;
    }

    /// findOneAndDelete
    async findOneAndDelete(filterQuery: FilterQuery<T>): Promise<T> {
        return this.model.findOneAndDelete(
            filterQuery, { lean: true }
        ) as unknown as T;  
    }
}
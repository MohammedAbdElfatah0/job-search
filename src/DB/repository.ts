import { FilterQuery, HydratedDocument, Model, ProjectionType, QueryOptions, Types, UpdateQuery } from 'mongoose';

export class AbstractRepository<T> {
    constructor(
        protected readonly model: Model<T>
    ) { }

    public async create(item: Partial<T>): Promise<HydratedDocument<T>> {
        const doc = new this.model(item);
        return doc.save() as Promise<HydratedDocument<T>>;
    }
    // public async createDoc(data: Partial<T>, option?: CreateOptions) {
    //     return await this.model.create([data], option)
    // }




    public async getOne(
        filter: FilterQuery<T>,
        projection?: ProjectionType<T>,
        option?: QueryOptions
    ): Promise<HydratedDocument<T> | null> {
        return this.model.findOne(filter, projection, option).exec();
    }

    public async updateOne(
        filter: FilterQuery<T>,
        updateQuery: UpdateQuery<T>,
        option?: QueryOptions
    ): Promise<HydratedDocument<T> | null> {
        return this.model.findOneAndUpdate(filter, updateQuery, {
            new: true,
            ...option,
        }).exec();
    }

    public async getAll(
        filter: FilterQuery<T>,
        projection?: ProjectionType<T>,
        option?: QueryOptions): Promise<HydratedDocument<T>[]> {
        return this.model.find(filter, projection, option).exec();
    }
    //soft delete as update in doc of schema field "deletedAt"
    public async softDeleteOne(
        id: string | Types.ObjectId, updateQuery: UpdateQuery<T>,
    ): Promise<HydratedDocument<T> | null> {
        return this.model.findOneAndUpdate(
            { _id: id },
            updateQuery,
            {
                new: true,
            }).exec();
    }

    public async hardDelete(id: string | Types.ObjectId): Promise<boolean> {
        const result = await this.model.deleteOne({ _id: id }).exec();
        return result.deletedCount > 0;
    }

}

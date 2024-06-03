import { Injectable } from '@nestjs/common';
import { Category } from './schemas/category.schema';
import { AbstractRepository } from 'src/helper/abstract.repository';
import { Connection, Model } from 'mongoose';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { PaginationResponseDto } from 'src/helper/pagination.schema';

@Injectable()
export class CategoryService extends AbstractRepository<Category> {
    constructor(
        @InjectModel(Category.name) model: Model<Category>,
        @InjectConnection() connection: Connection,
    ) {
        super(model, connection);
    }

    async findAll(identifier: any, limit?: number, page?: number): Promise<PaginationResponseDto<Category>> {
        const resposne = await this.paginate({
            'is_deleted': false,
            'identifier': identifier,
        }, limit, page);
        return resposne;
    }

}

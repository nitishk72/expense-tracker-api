import { Logger, NotFoundException } from '@nestjs/common';
import {
  FilterQuery,
  Model,
  Types,
  UpdateQuery,
  SaveOptions,
  Connection,
} from 'mongoose';
import { AbstractDocument } from './abstract.schema';
import { PaginatedMeta, PaginationResponseDto } from './pagination.schema';

export abstract class AbstractRepository<TDocument extends AbstractDocument> {
  protected logger: Logger = new Logger(AbstractRepository.name);

  constructor(
    protected readonly model: Model<TDocument>,
    private readonly connection: Connection,
  ) { }

  async create<T>(
    document: Omit<TDocument | T, '_id'>,
    options?: SaveOptions,
  ): Promise<TDocument> {
    const createdDocument = new this.model({
      ...document,
      _id: new Types.ObjectId(),
    });
    const doc = (
      await createdDocument.save(options)
    ).toJSON() as unknown as TDocument;
    delete doc.is_deleted;
    return doc;
  }

  async findOne(
    filterQuery: FilterQuery<TDocument>
  ): Promise<TDocument> {
    const document = await this.model.findOne(filterQuery, {}, { lean: false });

    if (!document) {
      this.logger.warn('Document not found with filterQuery', filterQuery);
      throw new NotFoundException('Document not found.');
    }

    return document.toJSON() as unknown as TDocument;;
  }

  async findOneAndUpdate(
    filterQuery: FilterQuery<TDocument>,
    update: UpdateQuery<TDocument>,
  ) {
    const document = await this.model.findOneAndUpdate(filterQuery, update, {
      lean: true,
      new: true,
    });

    if (!document) {
      this.logger.warn(`Document not found with filterQuery:`, filterQuery);
      throw new NotFoundException('Document not found.');
    }

    return document;
  }
  async delete(
    id: string,
  ): Promise<AbstractDocument> {
    const document = await this.model.findOneAndUpdate({
      _id: id,
      'is_deleted': false
    }, {
      'is_deleted': true
    }, {
      lean: true,
      new: true,
    });

    if (!document) {
      this.logger.warn(`Document might be already deleted or doesn't exist`);
      throw new NotFoundException('Document not found.');
    }

    return document;
  }

  async upsert(
    filterQuery: FilterQuery<TDocument>,
    document: Partial<TDocument>,
  ) {
    delete document.is_deleted;
    return this.model.findOneAndUpdate(filterQuery, document, {
      lean: true,
      upsert: true,
      new: true,
    });
  }

  async find(filterQuery: FilterQuery<TDocument>): Promise<Array<AbstractDocument>> {
    this.logger.log(`filter ${filterQuery}`);
    const data = await this.model.find(filterQuery, {}, { lean: true });
    return data;
  }

  async startTransaction() {
    const session = await this.connection.startSession();
    session.startTransaction();
    return session;
  }

  async count(query: any): Promise<number> {
    return this.model.countDocuments(query);
  }

  async paginate(filterQuery: FilterQuery<TDocument>, limit?: number, page?: number): Promise<PaginationResponseDto<TDocument>> {
    const _limit = limit || 10;
    const _page = page || 1;
    const docs = await this.model
      .find<TDocument>(filterQuery, {}, { lean: true })
      .skip((_page - 1) * _limit)
      .limit(_limit);
    const total = await this.count(filterQuery);
    const meta = new PaginatedMeta();
    meta.total_items = total;
    meta.total_pages = Math.ceil(total / _limit);
    meta.per_page_item = +_limit;
    meta.current_page = +_page;
    meta.page_size = docs.length;
    meta.has_more_page = Math.ceil(total / _limit) > (+_page);

    const pagination = new PaginationResponseDto<TDocument>();
    pagination.items = docs as unknown as TDocument[];
    pagination.meta = meta;

    return pagination
  }
}
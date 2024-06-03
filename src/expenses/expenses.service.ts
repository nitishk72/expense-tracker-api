import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Expense } from './schemas/expense.schema';
import { Connection, Model } from 'mongoose';
import { AbstractRepository } from 'src/helper/abstract.repository';

@Injectable()
export class ExpensesService extends AbstractRepository<Expense> {
    constructor(
        @InjectModel(Expense.name) model: Model<Expense>,
        @InjectConnection() connection: Connection,
    ) {
        super(model, connection);
    }
}

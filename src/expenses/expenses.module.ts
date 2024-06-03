import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Expense, ExpenseSchema } from './schemas/expense.schema';
import { ExpensesService } from './expenses.service';
import { ExpensesController } from './expenses.controller';
import { ConfigService } from '@nestjs/config';
import { Category, CategorySchema } from 'src/category/schemas/category.schema';

@Module({
    imports: [
        MongooseModule.forRootAsync({
            useFactory: (configService: ConfigService) => ({
                uri: configService.get<string>('MONGODB_URI'),
            }),
            inject: [ConfigService],
        }),
        MongooseModule.forFeature([
            { name: Category.name, schema: CategorySchema },
            { name: Expense.name, schema: ExpenseSchema }
        ]),
    ],
    providers: [ExpensesService],
    controllers: [ExpensesController],
    exports: [ExpensesService]
})
export class ExpensesModule { }


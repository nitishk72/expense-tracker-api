import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Param, Post, Put, Query } from '@nestjs/common';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { JwtDecorator } from 'src/jwt/jwt.decorator';

@Controller('expenses')
@ApiTags('Expenses')
@ApiSecurity('bearer')
export class ExpensesController {
    constructor(private expenseService: ExpensesService) { }

    @HttpCode(HttpStatus.OK)
    @Get('')
    getAll(@JwtDecorator() token,
        @Query('limit') limit: number = 10,
        @Query('page') page: number = 1
    ) {
        if (token == null) throw new HttpException({ message: 'Token Missing', type: 'TokenMissingError' }, 401);

        return this.expenseService.paginate({
            userId: token.id,
            'is_deleted': false,
        }, limit, page);
    }

    @HttpCode(HttpStatus.OK)
    @Get('/:id')
    getById(@Param('id') id: string) {
        return this.expenseService.findOne({
            _id: id,
            'is_deleted': false,

        });
    }

    @HttpCode(HttpStatus.OK)
    @Post('')
    createExpense(@Body() createExpense: CreateExpenseDto, @JwtDecorator() token) {
        if (token == null) throw new HttpException({ message: 'Token Missing', type: 'TokenMissingError' }, 401);

        const payload = {
            ...createExpense,
            'userId': token.id,
            'is_deleted': false,
        }
        return this.expenseService.create(payload);
    }


    @HttpCode(HttpStatus.OK)
    @Put('/:id')
    updateExpense(@Param('id') id: string, @Body() createExpense: CreateExpenseDto, @JwtDecorator() token) {
        if (token == null) throw new HttpException({ message: 'Token Missing', type: 'TokenMissingError' }, 401);
        return this.expenseService.findOneAndUpdate({ _id: id }, createExpense);
    }

    @HttpCode(HttpStatus.OK)
    @Delete('/:id')
    deleteById(@Param('id') id: string, @JwtDecorator() token) {
        if (token == null) throw new HttpException({ message: 'Token Missing', type: 'TokenMissingError' }, 401);

        return this.expenseService.delete(id);
    }
}

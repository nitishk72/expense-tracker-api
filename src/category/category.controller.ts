import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Param, Post, Put, Query } from '@nestjs/common';
import { CategoryService } from './category.service';
import { JwtDecorator } from 'src/jwt/jwt.decorator';
import { CreateCategoryDto } from './dto/create-category.dto';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';

@Controller('category')
@ApiTags('Category')
@ApiSecurity('bearer')
export class CategoryController {
    constructor(private categoryService: CategoryService) { }

    @HttpCode(HttpStatus.OK)
    @Get('')
    getAll(
        @JwtDecorator() token,
        @Query('limit') limit: number = 10,
        @Query('page') page: number = 1
    ) {
        if (token == null) throw new HttpException({ message: 'Token Missing', type: 'TokenMissingError' }, 401);
        return this.categoryService.paginate({
            userId: token.id,
            'is_deleted': false,
        }, limit, page);
    }

    @HttpCode(HttpStatus.OK)
    @Get('/:id')
    getById(@Param('id') id: string) {
        return this.categoryService.findOne({
            _id: id,
            'is_deleted': false,
        });
    }

    @HttpCode(HttpStatus.OK)
    @Post('')
    createExpense(@Body() createExpense: CreateCategoryDto, @JwtDecorator() token) {
        if (token == null) throw new HttpException({ message: 'Token Missing', type: 'TokenMissingError' }, 401);
        const payload = {
            ...createExpense,
            'userId': token.id,
            'is_deleted': false,
        }
        return this.categoryService.create(payload);
    }


    @HttpCode(HttpStatus.OK)
    @Put('/:id')
    updateExpense(@Param('id') id: string, @Body() createExpense: CreateCategoryDto, @JwtDecorator() token) {
        if (token == null) throw new HttpException({ message: 'Token Missing', type: 'TokenMissingError' }, 401);
        return this.categoryService.findOneAndUpdate({ _id: id }, createExpense);
    }

    @HttpCode(HttpStatus.OK)
    @Delete('/:id')
    deleteById(@Param('id') id: string, @JwtDecorator() token) {
        if (token == null) throw new HttpException({ message: 'Token Missing', type: 'TokenMissingError' }, 401);
        return this.categoryService.delete(id);
    }
}

import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ExpensesModule } from './expenses/expenses.module';
import { ConfigModule } from '@nestjs/config';
import { CategoryModule } from './category/category.module';
import * as Joi from 'joi';
import { AppController } from './app.controller';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';


@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 60000,
        limit: 20,
      },
      {
        name: 'medium',
        ttl: 3600000,
        limit: 600
      },
      {
        name: 'long',
        ttl: 86400000,
        limit: 3600
      }
    ]),
    UsersModule,
    AuthModule,
    ExpensesModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(),
        PORT: Joi.number().required(),
      }),
      envFilePath: './src/.env'
    }),
    CategoryModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    },
  ],
})
export class AppModule { }

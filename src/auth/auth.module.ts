
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { jwtConstants } from './constants';
import { User, UserSchema } from './schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { UserToken, UserTokenSchema } from './schemas/user-token.schema';
import { TokenService } from './token.service';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    // User,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
    MongooseModule.forFeature([{
      name: User.name,
      schema: UserSchema,
    }]),
    MongooseModule.forFeature([{
      name: UserToken.name,
      schema: UserTokenSchema,
    }]),
    UsersModule,
  ],
  providers: [AuthService, TokenService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule { }
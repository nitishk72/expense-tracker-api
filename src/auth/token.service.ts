import { Injectable } from '@nestjs/common';
import { AbstractRepository } from 'src/helper/abstract.repository';
import { UserToken } from './schemas/user-token.schema';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from './schemas/user.schema';
import mongoose, { Connection, Model } from 'mongoose';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';



@Injectable()
export class TokenService extends AbstractRepository<UserToken> {


  constructor(
    @InjectModel(UserToken.name) model: Model<UserToken>,
    @InjectConnection() connection: Connection,
  ) {
    super(model, connection);
  }

  async save(id: string): Promise<string> {
    const jwtService = new JwtService();
    const payload = {
      user_id: id,
    };
    const refreshToken = jwtService.sign(payload, {
      secret: 'JWT_ACCESS_SECRET',
      expiresIn: '15m',
    });
    const tokenCreate = {
      _id: new mongoose.Types.ObjectId(),
      userId: id,
      userAgent: '',
      refreshToken: refreshToken,
    };
    const token = await this.model.create(tokenCreate);
    return refreshToken;
  }

}
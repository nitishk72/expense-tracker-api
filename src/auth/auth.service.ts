import { HttpException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import * as bcrypt from 'bcrypt';
import mongoose, { Connection, Model } from 'mongoose';
import { AbstractRepository } from 'src/helper/abstract.repository';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { TokenService } from './token.service';



@Injectable()
export class AuthService extends AbstractRepository<User> {

    constructor(
        private usersService: UsersService,
        private tokenService: TokenService,
        private jwtService: JwtService,
        @InjectModel(User.name) model: Model<User>,
        @InjectConnection() connection: Connection,
    ) {
        super(model, connection);
    }


    async register(
        createUserDto: CreateUserDto,
    ): Promise<User | null> {
        const oldUser = await this.usersService.findOne(createUserDto.email);
        if (oldUser) {
            throw new HttpException('Email Already Exist', 400);
        }
        const salt = await bcrypt.genSalt();
        const password = await bcrypt.hash(createUserDto.password, salt);
        createUserDto.password = password;
        createUserDto._id = new mongoose.Types.ObjectId();
        const user = await this.usersService.save(createUserDto);
        return user;
    }

    async signIn(
        loginUserDto: LoginUserDto,
    ): Promise<{ token: string, id: string, refreshToken?: string }> {
        const user = await this.usersService.findOne(loginUserDto.email);

        if (!user) {
            throw new NotFoundException();
        }
        const hasSamePassword = await bcrypt.compare(loginUserDto.password, user.password);
        if (!hasSamePassword) {
            throw new UnauthorizedException('Invalid credentials');
        }
        return this.generateTokenForUserId(user._id.toString());
    }

    async generateTokenForUserId(id: string): Promise<{ token: string, id: string, refreshToken?: string }> {
        const jwtPayload = {
            id: id,
        };
        const jwtOptions = {
            secret: 'JWT_ACCESS_SECRET',
            expiresIn: '15m',
        };
        const token = this.jwtService.sign(jwtPayload, jwtOptions);
        const refreshToken = await this.tokenService.save(id);
        return { token, refreshToken, id: id };
    }
}
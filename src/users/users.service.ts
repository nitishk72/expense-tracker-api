import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';
import { User } from 'src/auth/schemas/user.schema';


@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private readonly userModel: Model<User>) { }

    async findOne(email: string): Promise<User | undefined> {
        return this.userModel.findOne({ email })
    }


    async save(createUserDto: CreateUserDto): Promise<User | undefined> {
        const createdCat = new this.userModel(createUserDto);
        return createdCat.save();
    }
}

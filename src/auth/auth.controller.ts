
import { Body, Controller, Post, HttpCode, HttpStatus, Get, HttpException, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtDecorator } from 'src/jwt/jwt.decorator';
import mongoose from 'mongoose';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
import { TokenService } from './token.service';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private tokenService: TokenService,
    ) { }

    @HttpCode(HttpStatus.OK)
    @Post('register')
    register(@Body() signInDto: CreateUserDto) {
        return this.authService.register(signInDto);
    }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    async signIn(@Body() signInDto: LoginUserDto) {
        const { token, id, refreshToken } = await this.authService.signIn(signInDto);;
        const user = await this.authService.findOne({ _id: new mongoose.Types.ObjectId(id) });
        return { token, refreshToken, user }
    }

    @HttpCode(HttpStatus.OK)
    @Get('refreshToken')
    async refreshToken(@Headers('refresh-token') refreshToken: string) {
        const exist = await this.tokenService.findOne({ refreshToken, });
        if (exist && exist['usedAt'] != null) {
            throw new HttpException({ message: 'Refresh Token Used', type: 'TokenUsedError' }, 401);
        }
        const user = await this.tokenService.findOneAndUpdate({ refreshToken }, { usedAt: Date.now() });
        return await this.authService.generateTokenForUserId(user.userId);
    }

    @HttpCode(HttpStatus.OK)
    @Get('me')
    @ApiSecurity('bearer')
    me(@JwtDecorator() jwt) {
        if (jwt == null) throw new HttpException({ message: 'Token Missing', type: 'TokenMissingError' }, 401);
        const user = this.authService.findOne({ _id: new mongoose.Types.ObjectId(jwt.id) });
        return user;
    }


    @HttpCode(HttpStatus.OK)
    @Get('update-password')
    @ApiSecurity('bearer')
    updatePassword(@JwtDecorator() jwt, @Body() updatePassword: UpdateUserPasswordDto) {
        if (jwt == null) throw new HttpException({ message: 'Token Missing', type: 'TokenMissingError' }, 401);
        const id = jwt.id;
        const user = this.authService.findOneAndUpdate({ _id: id }, updatePassword);
        return user;
    }
}
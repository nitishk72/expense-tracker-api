import { ExecutionContext, HttpException, UnauthorizedException, createParamDecorator } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';


export const JwtDecorator = createParamDecorator(async (factory, ctx: ExecutionContext) => {
    const jwtService = new JwtService();
    const req = ctx.switchToHttp().getRequest();
    let token = req.headers['authorization'] as string;
    if (!token) return null;
    if (token.startsWith('Bearer')) {
        token = token.split(' ')[1];
    }
    try {
        const options = {
            secret: 'JWT_ACCESS_SECRET'
        };
        const payload = await jwtService.verifyAsync(token, options);
        return payload;
    } catch (error) {
        throw new HttpException({ message: 'Token Expire', type: error.name }, 401);
    }
});
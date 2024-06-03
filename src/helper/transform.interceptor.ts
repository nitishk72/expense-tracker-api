import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
    data?: T;
    items?: Array<T>;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
        if (context.getType<string>() == 'graphql') {
            return next.handle();
        }
        const response = context.switchToHttp().getResponse();
        const request = context.switchToHttp().getRequest();
        let nstackIdentifier = request.headers['x-nstack-identifer'] as string;
        let ipAddress = (request.headers['x-forwarded-for'] as string || '').split(',')[0]
        if (!ipAddress) {
            ipAddress = request.socket.remoteAddress?.toString().split(':').pop() || ''
        }
        let status = response.statusCode;
        response.statusCode = status;
        response.header('x-nstack-identifer', nstackIdentifier ?? ipAddress);
        return next.handle().pipe(map((data) => {
            if (data.constructor.name == 'PaginationResponseDto') {
                return {
                    code: status,
                    success: status < 400,
                    timestamp: Date.now(),
                    message: 'Paginated Response',
                    ...data
                };
            }
            return {
                code: status,
                success: status < 400,
                timestamp: Date.now(),
                message: 'success',
                data: data,
            };
        }));
    }
}
import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IpAddress } from './helper/ip.decorator';

@Controller('')
@ApiTags('API Health')
export class AppController {

    @HttpCode(HttpStatus.OK)
    @Get('/health')
    health(
        @IpAddress() ip,
    ) {
        console.error('Health Interceptor');
        return { ip };
    }

}

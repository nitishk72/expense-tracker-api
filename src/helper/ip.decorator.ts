import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const IpAddress = createParamDecorator((data, ctx: ExecutionContext) => {
	const type = ctx.getType<string>();
	if (type == 'graphql') {
		return null;
	}
	const req = ctx.switchToHttp().getRequest();
	let ipAddress = (req.headers['x-forwarded-for'] as string || '').split(',')[0]
	if (!ipAddress) {
		ipAddress = req.socket.remoteAddress?.toString().split(':').pop() || ''
	}
	return ipAddress;
});
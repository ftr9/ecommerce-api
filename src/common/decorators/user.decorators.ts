import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const AuthorizedUser = createParamDecorator(
  (data: any, context: ExecutionContext) => {
    return context.switchToHttp().getRequest()?.user;
  },
);

export const GuestUser = createParamDecorator(
  (data: any, context: ExecutionContext) => {
    return context.switchToHttp().getRequest()?.session;
  },
);

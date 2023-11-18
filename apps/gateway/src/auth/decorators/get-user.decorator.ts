import { AuthType } from '@libs/common/interfaces/common.interface';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator(
  (key: string, context: ExecutionContext) => {
    const request: Express.Request = context.switchToHttp().getRequest();
    const user: AuthType = request.user as AuthType;
    return key ? user?.[key] : user;
  },
);

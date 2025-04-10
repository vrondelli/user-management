import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthUserData } from '../../types/auth-user-data';
import { AuthDataPipeFactory } from '../pipes/auth-user-data.pipe';

export const AuthUserDataParam = () =>
  createParamDecorator((data: unknown, ctx: ExecutionContext): AuthUserData => {
    return ctx.switchToHttp().getRequest();
  })(AuthDataPipeFactory());

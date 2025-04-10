import { Authorize } from '@application/auth/use-cases/authorize.use-case';
import { AuthProvider } from '@framework/auth/providers/auth-user.provider';
import { AuthUserData } from '@framework/types/auth-user-data';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LocalAuthProvider extends AuthProvider {
  constructor(private readonly authorizeUseCase: Authorize) {
    super();
  }
  async authorize(sessionId: string): Promise<AuthUserData> {
    const {
      session: {
        user: { id: userId, organizationId },
        role,
      },
    } = await this.authorizeUseCase.execute({ sessionId });
    return {
      sessionId,
      organizationId,
      userId,
      permissions: role.getPermissionNames(),
    };
  }
}

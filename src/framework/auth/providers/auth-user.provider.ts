import { AuthUserData } from '@framework/types/auth-user-data';
import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class AuthProvider {
  abstract authorize(sessionId: string): Promise<AuthUserData>;
}

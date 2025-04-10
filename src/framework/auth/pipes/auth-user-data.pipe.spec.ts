import { AuthUserData } from '../../types/auth-user-data';
import { AuthDataPipeFactory } from './auth-user-data.pipe';
import { AuthExpressRequest } from '../guards/auth.guard';

describe('AuthUserDataPipe', () => {
  it('should merge user auth data with value', () => {
    const value = { key: 'value' };
    const authUserData: AuthUserData = {
      organizationId: 'testOrgId',
      userId: 'testUser',
      sessionId: 'testSession',
      permissions: ['read', 'write'],
    };
    const request = { authUserData } as AuthExpressRequest;

    const pipe = new (AuthDataPipeFactory({
      organizationId: 'organizationId',
    }))(request);

    const result = pipe.transform(value);

    expect(result).toEqual({
      ...value,
      organizationId: authUserData.organizationId,
    });
  });
});

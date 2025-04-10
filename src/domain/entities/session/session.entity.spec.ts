import { Session } from './session.entity';
import { User } from '../user/user.entity';
import { Role } from '../role/role.entity';

describe('Session Entity', () => {
  let mockUser: User;
  let mockRole: Role;

  beforeEach(() => {
    mockUser = { id: 'user1', name: 'Test User' } as User;
    mockRole = { id: 'role1', name: 'Admin' } as Role;
  });

  it('should create a session with default session time', () => {
    const session = Session.create({ user: mockUser, role: mockRole });

    expect(session.user).toBe(mockUser);
    expect(session.role).toBe(mockRole);
    expect(session.expiresAt).toBeGreaterThan(new Date().getTime());
    expect(session.isExpired()).toBe(false);
  });

  it('should create a session with custom session time', () => {
    const customSessionTime = 10 * 60 * 1000; // 10 minutes
    const session = Session.create({
      user: mockUser,
      role: mockRole,
      sessionTime: customSessionTime,
    });

    const expectedExpiration = new Date().getTime() + customSessionTime;
    expect(session.expiresAt).toBeGreaterThanOrEqual(expectedExpiration - 100);
    expect(session.expiresAt).toBeLessThanOrEqual(expectedExpiration + 100);
  });

  it('should return true if the session is expired', () => {
    const expiredSession = new Session({
      id: 'session1',
      user: mockUser,
      role: mockRole,
      expiresAt: new Date().getTime() - 1000, // 1 second in the past
    });

    expect(expiredSession.isExpired()).toBe(true);
  });

  it('should return false if the session is not expired', () => {
    const validSession = new Session({
      id: 'session1',
      user: mockUser,
      role: mockRole,
      expiresAt: new Date().getTime() + 1000, // 1 second in the future
    });

    expect(validSession.isExpired()).toBe(false);
  });

  it('should set defaultSessionTime to 5 minutes', () => {
    expect(Session.defaultSessionTime).toBe(60 * 5 * 1000);
  });
});

import { Permission } from './permission.entity';

describe('Permission Entity', () => {
  it('should return true when granted permission matches required permission', () => {
    const permission = new Permission('1', 'user.read', '2023-01-01');
    expect(permission.match('user.read')).toBe(true);
  });

  it('should return false when granted permission does not match required permission', () => {
    const permission = new Permission('1', 'user.read', '2023-01-01');
    expect(permission.match('user.write')).toBe(false);
  });

  it('should return true when granted permission has a wildcard (*)', () => {
    const permission = new Permission('1', 'user.*', '2023-01-01');
    expect(permission.match('user.read')).toBe(true);
    expect(permission.match('user.write')).toBe(true);
  });

  it('should return false when required permission has more parts than granted permission', () => {
    const permission = new Permission('1', 'user.read', '2023-01-01');
    expect(permission.match('user.read.details')).toBe(false);
  });

  it('should return false when granted permission has more parts than required permission', () => {
    const permission = new Permission('1', 'user.read.details', '2023-01-01');
    expect(permission.match('user.read')).toBe(false);
  });

  it('should handle optional description property correctly', () => {
    const permissionWithDescription = new Permission(
      '1',
      'user.read',
      '2023-01-01',
      'Allows reading user data',
    );
    expect(permissionWithDescription.description).toBe(
      'Allows reading user data',
    );

    const permissionWithoutDescription = new Permission(
      '2',
      'user.write',
      '2023-01-01',
    );
    expect(permissionWithoutDescription.description).toBeUndefined();
  });

  it('should return false when granted permission and required permission are completely different', () => {
    const permission = new Permission('1', 'admin.read', '2023-01-01');
    expect(permission.match('user.read')).toBe(false);
  });

  it('should return true when wildcard (*) is at the root level', () => {
    const permission = new Permission('1', '*', '2023-01-01');
    expect(permission.match('user.read')).toBe(true);
    expect(permission.match('admin.write')).toBe(true);
  });
});

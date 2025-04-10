import { Role } from './role.entity';
import { Permission } from '../permission/permission.entity';

describe('Role Entity', () => {
  it('should return all permission names', () => {
    const permissions = [
      new Permission('1', 'user.read', '2023-01-01'),
      new Permission('2', 'user.write', '2023-01-01'),
    ];
    const role = new Role('1', 'Admin', permissions, '2023-01-01');

    expect(role.getPermissionNames()).toEqual(['user.read', 'user.write']);
  });

  it('should return true if the role has the required permission', () => {
    const permissions = [
      new Permission('1', 'user.read', '2023-01-01'),
      new Permission('2', 'user.write', '2023-01-01'),
    ];
    const role = new Role('1', 'Admin', permissions, '2023-01-01');

    const requiredPermission = new Permission('3', 'user.read', '2023-01-01');
    expect(role.hasPermission(requiredPermission)).toBe(true);
  });

  it('should return false if the role does not have the required permission', () => {
    const permissions = [
      new Permission('1', 'user.read', '2023-01-01'),
      new Permission('2', 'user.write', '2023-01-01'),
    ];
    const role = new Role('1', 'Admin', permissions, '2023-01-01');

    const requiredPermission = new Permission('3', 'admin.read', '2023-01-01');
    expect(role.hasPermission(requiredPermission)).toBe(false);
  });

  it('should return true if the role has all required permissions', () => {
    const permissions = [
      new Permission('1', 'user.read', '2023-01-01'),
      new Permission('2', 'user.write', '2023-01-01'),
    ];
    const role = new Role('1', 'Admin', permissions, '2023-01-01');

    const requiredPermissions = [
      new Permission('3', 'user.read', '2023-01-01'),
      new Permission('4', 'user.write', '2023-01-01'),
    ];
    expect(role.hasAllPermissions(requiredPermissions)).toBe(true);
  });

  it('should return false if the role does not have all required permissions', () => {
    const permissions = [
      new Permission('1', 'user.read', '2023-01-01'),
      new Permission('2', 'user.write', '2023-01-01'),
    ];
    const role = new Role('1', 'Admin', permissions, '2023-01-01');

    const requiredPermissions = [
      new Permission('3', 'user.read', '2023-01-01'),
      new Permission('4', 'admin.write', '2023-01-01'),
    ];
    expect(role.hasAllPermissions(requiredPermissions)).toBe(false);
  });

  it('should handle roles with no permissions', () => {
    const role = new Role('1', 'Guest', [], '2023-01-01');

    const requiredPermission = new Permission('1', 'user.read', '2023-01-01');
    expect(role.hasPermission(requiredPermission)).toBe(false);
    expect(role.hasAllPermissions([requiredPermission])).toBe(false);
  });

  it('should handle roles with wildcard (*) permissions', () => {
    const permissions = [new Permission('1', '*', '2023-01-01')];
    const role = new Role('1', 'SuperAdmin', permissions, '2023-01-01');

    const requiredPermissions = [
      new Permission('2', 'user.read', '2023-01-01'),
      new Permission('3', 'admin.write', '2023-01-01'),
    ];
    expect(role.hasAllPermissions(requiredPermissions)).toBe(true);
  });
});

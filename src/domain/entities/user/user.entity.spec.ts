import { User } from './user.entity';
import { Role } from '../role/role.entity';
import { Permission } from '../permission/permission.entity';

describe('User Entity', () => {
  it('should allow assigning a role if the user has all required permissions', () => {
    const permissions = [
      new Permission('1', 'role.assign', '2023-01-01'),
      new Permission('2', 'role.manage', '2023-01-01'),
    ];
    const userRole = new Role('1', 'Admin', permissions, '2023-01-01');
    const user = new User(
      '1',
      'John Doe',
      'john@example.com',
      'password123',
      userRole,
      '2023-01-01',
    );

    const targetRolePermissions = [
      new Permission('3', 'role.assign', '2023-01-01'),
    ];
    const targetRole = new Role(
      '2',
      'Manager',
      targetRolePermissions,
      '2023-01-01',
    );

    expect(user.canAssignRole(targetRole)).toBe(true);
  });

  it('should not allow assigning a role if the user lacks required permissions', () => {
    const permissions = [new Permission('1', 'role.assign', '2023-01-01')];
    const userRole = new Role('1', 'Admin', permissions, '2023-01-01');
    const user = new User(
      '1',
      'John Doe',
      'john@example.com',
      'password123',
      userRole,
      '2023-01-01',
    );

    const targetRolePermissions = [
      new Permission('2', 'role.manage', '2023-01-01'),
    ];
    const targetRole = new Role(
      '2',
      'Manager',
      targetRolePermissions,
      '2023-01-01',
    );

    expect(user.canAssignRole(targetRole)).toBe(false);
  });

  it('should allow assigning a role if the user has wildcard (*) permission', () => {
    const permissions = [new Permission('1', '*', '2023-01-01')];
    const userRole = new Role('1', 'SuperAdmin', permissions, '2023-01-01');
    const user = new User(
      '1',
      'Jane Doe',
      'jane@example.com',
      'password123',
      userRole,
      '2023-01-01',
    );

    const targetRolePermissions = [
      new Permission('2', 'role.assign', '2023-01-01'),
      new Permission('3', 'role.manage', '2023-01-01'),
    ];
    const targetRole = new Role(
      '2',
      'Manager',
      targetRolePermissions,
      '2023-01-01',
    );

    expect(user.canAssignRole(targetRole)).toBe(true);
  });

  it('should handle users with no permissions', () => {
    const userRole = new Role('1', 'Guest', [], '2023-01-01');
    const user = new User(
      '1',
      'John Doe',
      'john@example.com',
      'password123',
      userRole,
      '2023-01-01',
    );

    const targetRolePermissions = [
      new Permission('1', 'role.assign', '2023-01-01'),
    ];
    const targetRole = new Role(
      '2',
      'Manager',
      targetRolePermissions,
      '2023-01-01',
    );

    expect(user.canAssignRole(targetRole)).toBe(false);
  });

  it('should handle assigning a role with no permissions', () => {
    const permissions = [new Permission('1', 'role.assign', '2023-01-01')];
    const userRole = new Role('1', 'Admin', permissions, '2023-01-01');
    const user = new User(
      '1',
      'John Doe',
      'john@example.com',
      'password123',
      userRole,
      '2023-01-01',
    );

    const targetRole = new Role('2', 'Guest', [], '2023-01-01');

    expect(user.canAssignRole(targetRole)).toBe(true);
  });
});

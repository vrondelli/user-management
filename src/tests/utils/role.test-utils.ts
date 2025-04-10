import { Permission } from '@domain/entities/permission/permission.entity';
import { Role } from '@domain/entities/role/role.entity';
import { RoleEntity } from '@infra/database/type-orm/models/role.type-orm.entity';
import { createMockTypeOrmEntity } from './type-orm.test-utils';
import { PermissionEntity } from '@infra/database/type-orm/models/permission.type-orm.entity';
import { RoleRepository } from '@domain/repositories/role.repository';
import { RoleService } from '@domain/services/role/role.service';

export const createMockPermission = (
  overrides: Partial<Permission> = {},
): Permission => {
  return new Permission(
    overrides.id || Math.floor(Math.random() * 1000).toString(),
    overrides.name || 'default.permission',
    overrides.createdAt || new Date().toISOString(),
    overrides.description,
  );
};

export const createMockRole = (overrides: Partial<Role> = {}): Role => {
  return new Role(
    overrides.id || Math.floor(Math.random() * 1000).toString(),
    overrides.name || 'default_role',
    overrides.permissions || [createMockPermission()],
    overrides.createdAt || new Date().toISOString(),
    overrides.description || 'default_role_description',
    overrides.updatedAt || new Date().toISOString(),
  );
};

export const createTypeOrmMockPermission = (
  overrides: Partial<Permission> = {},
): PermissionEntity => {
  return createMockTypeOrmEntity(PermissionEntity, {
    id: Math.floor(Math.random() * 1000).toString(),
    name: 'default.permission',
    description: 'default.permission.description',
    ...overrides,
    createdAt: new Date(overrides.createdAt || new Date()),
  });
};

export const createMockTypeOrmRole = (
  overrides: Partial<Role> = {},
): RoleEntity => {
  return createMockTypeOrmEntity(RoleEntity, {
    id: Math.floor(Math.random() * 1000).toString(),
    name: 'default_role',
    description: 'default_role_description',
    ...overrides,
    createdAt: new Date(overrides.createdAt || new Date()),
    updatedAt: new Date(overrides.updatedAt || new Date()),
    permissions: overrides.permissions
      ? overrides.permissions.map(createTypeOrmMockPermission)
      : [createTypeOrmMockPermission()],
  });
};

export const createRoleRepositoryMock = ({
  getByName = jest.fn(),
}: Partial<RoleRepository> = {}): RoleRepository => ({
  getByName,
});

export const createRoleRepositoryMockProvider = (
  overrides: Partial<RoleRepository> = {},
): { provide: typeof RoleRepository; useValue: RoleRepository } => ({
  provide: RoleRepository,
  useValue: createRoleRepositoryMock(overrides),
});

export const createRoleServiceMock = ({
  getRoleByName = jest.fn(),
}: Partial<RoleService> = {}): RoleService =>
  ({
    getRoleByName,
  }) as RoleService;

export const createRoleServiceMockProvider = (
  overrides: Partial<RoleService> = {},
): { provide: typeof RoleService; useValue: RoleService } => ({
  provide: RoleService,
  useValue: createRoleServiceMock(overrides),
});

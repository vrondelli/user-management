import { UserEntity } from '@infra/database/type-orm/models/user.type-orm.entity';
import { createMockTypeOrmEntity } from './type-orm.test-utils';
import { User } from '@domain/entities/user/user.entity';
import {
  SaveUserParams,
  UserRepository,
} from '@domain/repositories/user.repository';
import { createMockRole, createMockTypeOrmRole } from './role.test-utils';
import { UserService } from '@domain/services/user/user.service';
import { CryptoService } from '@domain/services/crypto.service';

export const createMockTypeOrmUser = (overrides: Partial<User> = {}) => {
  return createMockTypeOrmEntity(UserEntity, {
    id: Math.floor(Math.random() * 1000).toString(),
    name: 'test_user',
    email: 'test_user@example.com',
    password: 'hashed_password',
    organizationId: 'test_organization',
    ...overrides,
    createdAt: new Date(overrides.createdAt || new Date()),
    updatedAt: new Date(overrides.updatedAt || new Date()),
    role: createMockTypeOrmRole(overrides.role),
  });
};

export const createMockUser = (overrides: Partial<User> = {}): User => {
  return new User({
    id: overrides.id || Math.floor(Math.random() * 1000).toString(),
    name: overrides.name || 'test_user',
    email: overrides.email || 'test_user@example.com',
    organizationId: overrides.organizationId || 'test_organization',
    password: overrides.password || 'hashed_password',
    role: overrides.role || createMockRole(),
    createdAt: overrides.createdAt || new Date().toISOString(),
    updatedAt: overrides.updatedAt || new Date().toISOString(),
  });
};

export const createMockSaveUserParams = (
  overrides: Partial<SaveUserParams> = {},
): SaveUserParams => {
  return {
    name: overrides.name || 'test_user',
    email: overrides.email || 'test_user@example.com',
    password: overrides.password || 'hashed_password',
    organizationId: overrides.organizationId || 'test_organization',
    role: overrides.role || createMockRole(),
  };
};

export const createUserRepositoryMock = ({
  create = jest.fn(),
  findUserByEmail = jest.fn(),
  findUserById = jest.fn(),
}: Partial<UserRepository> = {}): UserRepository => ({
  create,
  findUserByEmail,
  findUserById,
});

export const createUserRepositoryMockProvider = (
  overrides: Partial<UserRepository> = {},
): { provide: typeof UserRepository; useValue: UserRepository } => ({
  provide: UserRepository,
  useValue: createUserRepositoryMock(overrides),
});

export const createUserServiceMock = ({
  validateUserExistsByEmail = jest.fn(),
  getUserById = jest.fn(),
  getUserByEmail = jest.fn(),
  validateUserCanAssignRole = jest.fn(),
  createUser = jest.fn(),
}: Partial<UserService> = {}): UserService =>
  ({
    validateUserExistsByEmail,
    getUserById,
    getUserByEmail,
    validateUserCanAssignRole,
    createUser,
  }) as UserService;

export const createUserServiceMockProvider = (
  overrides: Partial<UserService> = {},
): { provide: typeof UserService; useValue: UserService } => ({
  provide: UserService,
  useValue: createUserServiceMock(overrides),
});

export const createCryptoServiceMock = ({
  hashPassword = jest.fn(),
  comparePassword = jest.fn(),
}: Partial<CryptoService> = {}): CryptoService =>
  ({
    hashPassword,
    comparePassword,
  }) as CryptoService;

export const createCryptoServiceMockProvider = (
  overrides: Partial<CryptoService> = {},
): { provide: typeof CryptoService; useValue: CryptoService } => ({
  provide: CryptoService,
  useValue: createCryptoServiceMock(overrides),
});

import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserRepository } from '@domain/repositories/user.repository';
import { RoleService } from '../role/role.service';
import {
  createMockUser,
  createMockSaveUserParams,
  createUserRepositoryMockProvider,
} from '@tests/utils/user.test-utils';
import {
  createMockRole,
  createRoleServiceMockProvider,
} from '@tests/utils/role.test-utils';
import {
  UserAlreadyExistsError,
  UserCannotAssignRoleError,
  UserNotFoundByEmailError,
  UserNotFoundByIdError,
} from '@domain/error/user.error';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { beforeEach } from 'node:test';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: jest.Mocked<UserRepository>;
  let roleService: jest.Mocked<RoleService>;
  let cacheManager: jest.Mocked<Cache>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        createUserRepositoryMockProvider(),
        createRoleServiceMockProvider(),
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
          },
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get(UserRepository);
    roleService = module.get(RoleService);
    cacheManager = module.get(CACHE_MANAGER);
  });

  describe('createUser', () => {
    it('should create a user successfully', async () => {
      const saveUserParams = createMockSaveUserParams();
      const mockUser = createMockUser(saveUserParams);

      userRepository.create.mockResolvedValue(mockUser);

      const result = await userService.createUser(saveUserParams);

      expect(userRepository.create).toHaveBeenCalledWith(saveUserParams);
      expect(cacheManager.set).toHaveBeenCalledWith(
        `user:${mockUser.id}`,
        mockUser,
      );

      expect(result).toEqual(mockUser);
    });
  });

  describe('validateUserExistsByEmail', () => {
    it('should throw UserAlreadyExistsError if user exists', async () => {
      const email = 'test@example.com';
      const mockUser = createMockUser({ email });

      userRepository.findUserByEmail.mockResolvedValue(mockUser);

      await expect(
        userService.validateUserExistsByEmail(email),
      ).rejects.toThrow(UserAlreadyExistsError);

      expect(cacheManager.get).not.toHaveBeenCalled();

      expect(userRepository.findUserByEmail).toHaveBeenCalledWith(email);
    });

    it('should not throw if user does not exist', async () => {
      const email = 'test@example.com';

      userRepository.findUserByEmail.mockResolvedValue(null);

      await expect(
        userService.validateUserExistsByEmail(email),
      ).resolves.not.toThrow();

      expect(userRepository.findUserByEmail).toHaveBeenCalledWith(email);
    });
  });

  describe('getUserById', () => {
    it('should return a user if found', async () => {
      const id = '123';
      const mockUser = createMockUser({ id });

      userRepository.findUserById.mockResolvedValue(mockUser);
      cacheManager.get.mockResolvedValueOnce(null);

      const result = await userService.getUserById(id);

      expect(userRepository.findUserById).toHaveBeenCalledWith(id);
      expect(result).toEqual(mockUser);
    });

    it('should return a cached user if available', async () => {
      const id = '123';
      const mockUser = createMockUser({ id });

      userRepository.findUserById.mockResolvedValue(mockUser);
      cacheManager.get.mockResolvedValueOnce(mockUser);

      const result = await userService.getUserById(id);

      expect(cacheManager.get).toHaveBeenCalledWith(`user:${id}`);

      expect(userRepository.findUserById.mockClear()).not.toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });

    it('should throw UserNotFoundByIdError if user is not found', async () => {
      const id = '123';

      userRepository.findUserById.mockResolvedValue(null);

      await expect(userService.getUserById(id)).rejects.toThrow(
        UserNotFoundByIdError,
      );

      expect(userRepository.findUserById).toHaveBeenCalledWith(id);
    });
  });

  describe('getUserByEmail', () => {
    it('should return a user if found', async () => {
      const email = 'test@example.com';
      const mockUser = createMockUser({ email });

      userRepository.findUserByEmail.mockResolvedValue(mockUser);

      const result = await userService.getUserByEmail(email);

      expect(userRepository.findUserByEmail).toHaveBeenCalledWith(email);
      expect(cacheManager.get).not.toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });

    it('should throw UserNotFoundByEmailError if user is not found', async () => {
      const email = 'test@example.com';

      userRepository.findUserByEmail.mockResolvedValue(null);

      await expect(userService.getUserByEmail(email)).rejects.toThrow(
        UserNotFoundByEmailError,
      );

      expect(userRepository.findUserByEmail).toHaveBeenCalledWith(email);
    });
  });

  describe('validateUserCanAssignRole', () => {
    it('should return the role if the user can assign it', async () => {
      const userId = '123';
      const roleName = 'admin';
      const mockRole = createMockRole({ name: roleName });
      const mockUser = createMockUser({ id: userId, role: mockRole });

      userRepository.findUserById.mockResolvedValue(mockUser);
      roleService.getRoleByName.mockResolvedValue(mockRole);

      const result = await userService.validateUserCanAssignRole(
        userId,
        roleName,
      );

      expect(userRepository.findUserById).toHaveBeenCalledWith(userId);
      expect(roleService.getRoleByName).toHaveBeenCalledWith(roleName);
      expect(result).toEqual(mockRole);
    });

    it('should throw UserCannotAssignRoleError if the user cannot assign the role', async () => {
      const userId = '123';
      const roleName = 'admin';
      const mockUser = createMockUser({ id: userId });
      const mockRole = createMockRole({ name: roleName });

      userRepository.findUserById.mockResolvedValue(mockUser);
      roleService.getRoleByName.mockResolvedValue(mockRole);

      jest.spyOn(mockUser, 'canAssignRole').mockReturnValue(false);

      await expect(
        userService.validateUserCanAssignRole(userId, roleName),
      ).rejects.toThrow(UserCannotAssignRoleError);

      expect(userRepository.findUserById).toHaveBeenCalledWith(userId);
      expect(roleService.getRoleByName).toHaveBeenCalledWith(roleName);
    });
  });
});

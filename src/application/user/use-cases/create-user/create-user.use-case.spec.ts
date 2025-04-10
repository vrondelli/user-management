import { Test, TestingModule } from '@nestjs/testing';
import { CreateUser } from './create-user.use-case';
import { UserService } from '@domain/services/user/user.service';
import { CryptoService } from '@domain/services/crypto.service';
import {
  UserAlreadyExistsError,
  UserCannotAssignRoleError,
} from '@domain/error/user.error';
import {
  createCryptoServiceMockProvider,
  createMockUser,
  createUserServiceMockProvider,
} from '@tests/utils/user.test-utils';
import { createMockRole } from '@tests/utils/role.test-utils';

describe('CreateUser Use Case', () => {
  let createUser: CreateUser;
  let userService: jest.Mocked<UserService>;
  let cryptoService: jest.Mocked<CryptoService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateUser,
        createUserServiceMockProvider(),
        createCryptoServiceMockProvider(),
      ],
    }).compile();

    createUser = module.get<CreateUser>(CreateUser);
    userService = module.get(UserService);
    cryptoService = module.get(CryptoService);
  });

  it('should create a user successfully', async () => {
    const params = {
      email: 'test@example.com',
      password: 'securePassword123',
      name: 'Test User',
      role: 'admin',
      userCreatorId: 'creatorId',
    };

    const mockRole = createMockRole({ name: params.role });
    const mockUser = createMockUser({ id: '123', ...params, role: mockRole });

    userService.validateUserExistsByEmail.mockResolvedValueOnce(undefined);
    userService.validateUserCanAssignRole.mockResolvedValueOnce(mockRole);
    cryptoService.hashPassword.mockResolvedValueOnce('hashedPassword');
    userService.createUser.mockResolvedValueOnce(mockUser);

    const result = await createUser.execute(params);

    expect(userService.validateUserExistsByEmail).toHaveBeenCalledWith(
      params.email,
    );
    expect(userService.validateUserCanAssignRole).toHaveBeenCalledWith(
      params.userCreatorId,
      params.role,
    );
    expect(cryptoService.hashPassword).toHaveBeenCalledWith(params.password);
    expect(userService.createUser).toHaveBeenCalledWith({
      email: params.email,
      password: 'hashedPassword',
      name: params.name,
      role: mockRole,
    });
    expect(result).toEqual({
      message: 'User created successfully',
      id: mockUser.id,
    });
  });

  it('should throw UserAlreadyExistsError if the email is already taken', async () => {
    const params = {
      email: 'test@example.com',
      password: 'securePassword123',
      name: 'Test User',
      role: 'admin',
      userCreatorId: 'creatorId',
    };

    userService.validateUserExistsByEmail.mockRejectedValueOnce(
      new UserAlreadyExistsError(params.email),
    );

    await expect(createUser.execute(params)).rejects.toThrow(
      UserAlreadyExistsError,
    );

    expect(userService.validateUserExistsByEmail).toHaveBeenCalledWith(
      params.email,
    );
    expect(userService.validateUserCanAssignRole).not.toHaveBeenCalled();
    expect(cryptoService.hashPassword).not.toHaveBeenCalled();
    expect(userService.createUser).not.toHaveBeenCalled();
  });

  it('should throw UserCannotAssignRoleError if the creator cannot assign the role', async () => {
    const params = {
      email: 'test@example.com',
      password: 'securePassword123',
      name: 'Test User',
      role: 'admin',
      userCreatorId: 'creatorId',
    };

    userService.validateUserExistsByEmail.mockResolvedValueOnce(undefined);
    userService.validateUserCanAssignRole.mockRejectedValueOnce(
      new UserCannotAssignRoleError(params.userCreatorId, params.role),
    );

    await expect(createUser.execute(params)).rejects.toThrow(
      UserCannotAssignRoleError,
    );

    expect(userService.validateUserExistsByEmail).toHaveBeenCalledWith(
      params.email,
    );
    expect(userService.validateUserCanAssignRole).toHaveBeenCalledWith(
      params.userCreatorId,
      params.role,
    );
    expect(cryptoService.hashPassword).not.toHaveBeenCalled();
    expect(userService.createUser).not.toHaveBeenCalled();
  });

  it('should handle errors during password hashing', async () => {
    const params = {
      email: 'test@example.com',
      password: 'securePassword123',
      name: 'Test User',
      role: 'admin',
      userCreatorId: 'creatorId',
    };

    const mockRole = createMockRole({ name: params.role });

    userService.validateUserExistsByEmail.mockResolvedValueOnce(undefined);
    userService.validateUserCanAssignRole.mockResolvedValueOnce(mockRole);
    cryptoService.hashPassword.mockRejectedValueOnce(
      new Error('Hashing error'),
    );

    await expect(createUser.execute(params)).rejects.toThrow('Hashing error');

    expect(userService.validateUserExistsByEmail).toHaveBeenCalledWith(
      params.email,
    );
    expect(userService.validateUserCanAssignRole).toHaveBeenCalledWith(
      params.userCreatorId,
      params.role,
    );
    expect(cryptoService.hashPassword).toHaveBeenCalledWith(params.password);
    expect(userService.createUser).not.toHaveBeenCalled();
  });
});

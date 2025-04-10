import { Repository } from 'typeorm';
import { UserTypeOrmRepository } from './user.type-orm.repository';
import { UserEntity } from '../../models/user.type-orm.entity';
import { createTypeOrmRepositoryTestingModule } from '@tests/utils/type-orm.test-utils';
import {
  createMockSaveUserParams,
  createMockTypeOrmUser,
  createMockUser,
} from '@tests/utils/user.test-utils';
import { SaveUserParams } from '@domain/repositories/user.repository';
import { DatabaseError } from '@framework/errors/database.error';
import { ErrorReason } from '@framework/errors/error-reason';

describe('UserTypeOrmRepository', () => {
  let repository: UserTypeOrmRepository;
  let userRepositoryMock: jest.Mocked<Repository<UserEntity>>;

  beforeAll(async () => {
    const { module, typeOrmMockRepository } =
      await createTypeOrmRepositoryTestingModule(
        UserEntity,
        UserTypeOrmRepository,
      );

    repository = module.get<UserTypeOrmRepository>(UserTypeOrmRepository);
    userRepositoryMock = typeOrmMockRepository;
  });

  describe('create', () => {
    it('should create and save a user', async () => {
      const saveUserParams: SaveUserParams = createMockSaveUserParams();
      const user = createMockUser(saveUserParams);
      const savedUserEntity = createMockTypeOrmUser(user);
      const createResult = createTypeormCreateResult(savedUserEntity);

      userRepositoryMock.create.mockReturnValueOnce(createResult);
      userRepositoryMock.save.mockResolvedValueOnce(savedUserEntity);

      const result = await repository.create(saveUserParams);

      expect(userRepositoryMock.create).toHaveBeenCalledWith(saveUserParams);
      expect(userRepositoryMock.save).toHaveBeenCalledWith(createResult);
      expect(result).toEqual(user);
    });

    it('should throw a DatabaseError if an error occurs during creation', async () => {
      const saveUserParams: SaveUserParams = createMockSaveUserParams();
      const error = new Error('Database connection error');

      userRepositoryMock.create.mockImplementationOnce(() => {
        throw error;
      });

      await expect(repository.create(saveUserParams)).rejects.toThrow(
        createDatabaseError(error),
      );

      expect(userRepositoryMock.create).toHaveBeenCalledWith(saveUserParams);
    });
  });

  describe('findUserByEmail', () => {
    it('should return a user if found', async () => {
      const email = 'test@example.com';
      const user = createMockUser({ email });
      const userEntity = createMockTypeOrmUser(user);

      userRepositoryMock.findOne.mockResolvedValue(userEntity);

      const result = await repository.findUserByEmail(email);

      expect(userRepositoryMock.findOne).toHaveBeenCalledWith({
        where: { email },
      });
      expect(result).toEqual(user);
    });

    it('should return null if no user is found', async () => {
      const email = 'notfound@example.com';

      userRepositoryMock.findOne.mockResolvedValue(null);

      const result = await repository.findUserByEmail(email);

      expect(userRepositoryMock.findOne).toHaveBeenCalledWith({
        where: { email },
      });
      expect(result).toBeNull();
    });

    it('should throw a DatabaseError if an error occurs during retrieval', async () => {
      const email = 'notfound@example.com';
      const error = new Error('Database connection error');
      userRepositoryMock.findOne.mockRejectedValue(error);
      await expect(repository.findUserByEmail(email)).rejects.toThrow(
        createDatabaseError(error),
      );
      expect(userRepositoryMock.findOne).toHaveBeenCalledWith({
        where: { email },
      });
    });
  });

  describe('findUserById', () => {
    it('should return a user if found', async () => {
      const id = '123';
      const user = createMockUser({ id });
      const userEntity = createMockTypeOrmUser(user);

      userRepositoryMock.findOne.mockResolvedValue(userEntity);

      const result = await repository.findUserById(id);

      expect(userRepositoryMock.findOne).toHaveBeenCalledWith({
        where: { id },
      });
      expect(result).toEqual(user);
    });

    it('should return null if no user is found', async () => {
      const id = 'notfound';

      userRepositoryMock.findOne.mockResolvedValue(null);

      const result = await repository.findUserById(id);

      expect(userRepositoryMock.findOne).toHaveBeenCalledWith({
        where: { id },
      });
      expect(result).toBeNull();
    });

    it('should throw a DatabaseError if an error occurs during retrieval', async () => {
      const id = '123';
      const error = new Error('Database connection error');
      userRepositoryMock.findOne.mockRejectedValue(error);

      await expect(repository.findUserById(id)).rejects.toThrow(
        createDatabaseError(error),
      );

      expect(userRepositoryMock.findOne).toHaveBeenCalledWith({
        where: { id },
      });
    });
  });
});

const createTypeormCreateResult = (savedUser: UserEntity) => {
  return Object.assign(
    Object.create(Object.getPrototypeOf(savedUser)),
    savedUser,
    { id: undefined },
  );
};

const createDatabaseError = (error: unknown) => {
  return new DatabaseError(
    JSON.stringify(error, null, 2),
    ErrorReason.INTERNAL_SERVER_ERROR,
  );
};

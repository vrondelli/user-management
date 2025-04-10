import { Repository } from 'typeorm';
import { RoleTypeOrmRepository } from './role.type-orm.repository';
import { RoleEntity } from '../../models/role.type-orm.entity';
import {
  createMockTypeOrmRole,
  createMockRole,
} from '@tests/utils/role.test-utils';
import { createTypeOrmRepositoryTestingModule } from '@tests/utils/type-orm.test-utils';
import { DatabaseError } from '@framework/errors/database.error';
import { ErrorReason } from '@framework/errors/error-reason';

describe('RoleTypeOrmRepository', () => {
  let repository: RoleTypeOrmRepository;
  let roleRepositoryMock: jest.Mocked<Repository<RoleEntity>>;

  beforeAll(async () => {
    const { module, typeOrmMockRepository } =
      await createTypeOrmRepositoryTestingModule(
        RoleEntity,
        RoleTypeOrmRepository,
      );

    repository = module.get<RoleTypeOrmRepository>(RoleTypeOrmRepository);
    roleRepositoryMock = typeOrmMockRepository;
  });

  describe('getByName', () => {
    it('should return a role if found', async () => {
      const name = 'admin';
      const role = createMockRole({ name });
      const roleEntity = createMockTypeOrmRole(role);

      roleRepositoryMock.findOne.mockResolvedValue(roleEntity);

      const result = await repository.getByName(name);

      expect(roleRepositoryMock.findOne).toHaveBeenCalledWith({
        where: { name },
      });
      expect(result).toEqual(role);
    });

    it('should return null if no role is found', async () => {
      const name = 'nonexistent_role';

      roleRepositoryMock.findOne.mockResolvedValue(null);

      const result = await repository.getByName(name);

      expect(roleRepositoryMock.findOne).toHaveBeenCalledWith({
        where: { name },
      });
      expect(result).toBeNull();
    });

    it('should throw a DatabaseError if an error occurs during retrieval', async () => {
      const name = 'admin';
      const error = new Error('Database connection error');

      roleRepositoryMock.findOne.mockRejectedValue(error);

      await expect(repository.getByName(name)).rejects.toThrow(
        createDatabaseError(error),
      );

      expect(roleRepositoryMock.findOne).toHaveBeenCalledWith({
        where: { name },
      });
    });
  });
});

const createDatabaseError = (error: unknown) => {
  return new DatabaseError(
    JSON.stringify(error, null, 2),
    ErrorReason.INTERNAL_SERVER_ERROR,
  );
};

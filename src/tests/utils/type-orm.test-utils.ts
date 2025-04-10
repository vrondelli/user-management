import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TestingModule, Test } from '@nestjs/testing';

export const createMockTypeOrmEntity = <
  TypeOrmEntity extends {},
  DomainEntity extends {},
>(
  EntityClass: new () => TypeOrmEntity,
  mockValues: Partial<DomainEntity>,
): TypeOrmEntity => {
  const entity = new EntityClass();
  Object.assign(entity, mockValues);
  return entity;
};

export type MockTypeOrmRepository<Entity extends {}> = jest.Mocked<
  Repository<Entity>
>;

export const createTypeOrmMockRepository = <Entity extends {}>(): jest.Mocked<
  Repository<Entity>
> =>
  ({
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    preload: jest.fn(),
    count: jest.fn(),
    findOneBy: jest.fn(),
    findAndCount: jest.fn(),
  }) as unknown as MockTypeOrmRepository<Entity>;

export const createTypeOrmRepositoryTestingModule = async <
  Entity extends {},
  Repository,
>(
  EntityClass: new () => Entity,
  RepositoryClass: new (...args: any) => Repository,
): Promise<{
  module: TestingModule;
  typeOrmMockRepository: MockTypeOrmRepository<Entity>;
}> => {
  const mockRepository = createTypeOrmMockRepository<Entity>();

  const module = await Test.createTestingModule({
    providers: [
      RepositoryClass,
      {
        provide: getRepositoryToken(EntityClass),
        useValue: mockRepository,
      },
    ],
  }).compile();

  return {
    module,
    typeOrmMockRepository: mockRepository,
  };
};

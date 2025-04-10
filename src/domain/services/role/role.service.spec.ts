import { Test, TestingModule } from '@nestjs/testing';
import { RoleService } from './role.service';
import { RoleRepository } from '@domain/repositories/role.repository';
import { RoleNotFoundError } from '@domain/error/role.error';
import {
  createRoleRepositoryMockProvider,
  createMockRole,
} from '@tests/utils/role.test-utils';

describe('RoleService', () => {
  let roleService: RoleService;
  let roleRepository: jest.Mocked<RoleRepository>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoleService, createRoleRepositoryMockProvider()],
    }).compile();

    roleService = module.get<RoleService>(RoleService);
    roleRepository = module.get(RoleRepository);
  });

  describe('getRoleByName', () => {
    it('should return a role if found', async () => {
      const roleName = 'admin';
      const mockRole = createMockRole({ name: roleName });

      roleRepository.getByName.mockResolvedValue(mockRole);

      const result = await roleService.getRoleByName(roleName);

      expect(roleRepository.getByName).toHaveBeenCalledWith(roleName);
      expect(result).toEqual(mockRole);
    });

    it('should throw RoleNotFoundError if no role is found', async () => {
      const roleName = 'nonexistent_role';

      roleRepository.getByName.mockResolvedValue(null);

      await expect(roleService.getRoleByName(roleName)).rejects.toThrow(
        RoleNotFoundError,
      );

      expect(roleRepository.getByName).toHaveBeenCalledWith(roleName);
    });
  });
});

import { User } from '@domain/entities/user/user.entity';
import { RoleNotFoundError } from '@domain/error/role.error';
import { RoleRepository } from '@domain/repositories/role.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RoleService {
  constructor(private readonly roleRepository: RoleRepository) {}

  async getRoleByName(name: string) {
    const role = await this.roleRepository.getByName(name);
    if (!role) throw new RoleNotFoundError(name);
    return role;
  }
}

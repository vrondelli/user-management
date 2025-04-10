import { Role } from '@domain/entities/role/role.entity';

export abstract class RoleRepository {
  abstract getByName(name: string): Promise<Role | null>;
}

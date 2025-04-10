import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleRepository } from '@domain/repositories/role.repository';
import { Role } from '@domain/entities/role/role.entity';
import { RoleEntity } from '../../models/role.type-orm.entity';
import { DomainError } from '@framework/errors/domain.error';
import { DatabaseError } from '@framework/errors/database.error';
import { ErrorReason } from '@framework/errors/error-reason';

@Injectable()
export class RoleTypeOrmRepository extends RoleRepository {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
  ) {
    super();
  }

  async getByName(name: string): Promise<Role | null> {
    try {
      const roleEntity = await this.roleRepository.findOne({
        where: { name },
      });

      return roleEntity ? roleEntity.toDomain() : null;
    } catch (error) {
      throw this.handleDatabaseError(error);
    }
  }

  private handleDatabaseError(error: unknown): DomainError | DatabaseError {
    if (error instanceof DomainError) {
      return error;
    }
    return new DatabaseError(
      JSON.stringify(error, null, 2),
      ErrorReason.INTERNAL_SERVER_ERROR,
    );
  }
}

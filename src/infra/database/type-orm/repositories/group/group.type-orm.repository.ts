import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { GroupRepository } from '@domain/repositories/group.repository';
import { Group } from '@domain/entities/group/group.entity';
import { GroupTypeOrmEntity } from '../../models/group.type-orm.entity';
import { DatabaseError } from '@framework/errors/database.error';
import { ErrorReason } from '@framework/errors/error-reason';

@Injectable()
export class GroupTypeOrmRepository extends GroupRepository {
  constructor(
    @InjectRepository(GroupTypeOrmEntity)
    private readonly groupRepository: Repository<GroupTypeOrmEntity>,
  ) {
    super();
  }

  async getById(id: string): Promise<Group | null> {
    try {
      const groupEntity = await this.groupRepository.findOne({
        where: { id },
        relations: ['parent'],
      });

      if (!groupEntity) {
        return null;
      }

      const loadParents = async (
        entity: GroupTypeOrmEntity,
      ): Promise<GroupTypeOrmEntity> => {
        if (!entity.parent) {
          return entity;
        }
        const parentEntity = (await this.groupRepository.findOne({
          where: { id: entity.parent.id },
          relations: ['parent'],
        })) as GroupTypeOrmEntity;
        entity.parent = await loadParents(parentEntity);
        return entity;
      };

      await loadParents(groupEntity);

      return groupEntity.toDomain();
    } catch (error) {
      throw this.handleDatabaseError(error);
    }
  }

  async getByName(name: string): Promise<Group | null> {
    try {
      const groupEntity = await this.groupRepository.findOne({
        where: { name },
        relations: ['parent'],
      });

      if (!groupEntity) {
        return null;
      }

      const loadParents = async (
        entity: GroupTypeOrmEntity,
      ): Promise<GroupTypeOrmEntity> => {
        if (!entity.parent) {
          return entity;
        }
        const parentEntity = (await this.groupRepository.findOne({
          where: { id: entity.parent.id },
          relations: ['parent'],
        })) as GroupTypeOrmEntity;
        entity.parent = await loadParents(parentEntity);
        return entity;
      };

      await loadParents(groupEntity);

      return groupEntity.toDomain();
    } catch (error) {
      throw this.handleDatabaseError(error);
    }
  }

  private handleDatabaseError(error: unknown): DatabaseError {
    if (error instanceof Error) {
      return new DatabaseError(
        error.message,
        ErrorReason.INTERNAL_SERVER_ERROR,
      );
    }
    return new DatabaseError(
      JSON.stringify(error, null, 2),
      ErrorReason.INTERNAL_SERVER_ERROR,
    );
  }
}

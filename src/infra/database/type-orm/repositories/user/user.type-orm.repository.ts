import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  UserRepository,
  SaveUserParams,
  FindUserOptions,
} from '@domain/repositories/user.repository';
import { User } from '@domain/entities/user/user.entity';
import { UserEntity } from '../../models/user.type-orm.entity';
import { DomainError } from '@framework/errors/domain.error';
import { DatabaseError } from '@framework/errors/database.error';
import { ErrorReason } from '@framework/errors/error-reason';
import { GroupRepository } from '@domain/repositories/group.repository';
import { Group } from '@domain/entities/group/group.entity';

@Injectable()
export class UserTypeOrmRepository extends UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly groupRepository: GroupRepository,
  ) {
    super();
  }

  async create(user: SaveUserParams): Promise<User> {
    try {
      const userEntity = this.userRepository.create(user);

      const savedUser = await this.userRepository.save(userEntity);
      return savedUser.toDomain();
    } catch (error) {
      throw this.handleDatabaseError(error);
    }
  }

  async findUserByEmail(
    email: string,
    options?: FindUserOptions,
  ): Promise<User | null> {
    try {
      const userEntity = await this.userRepository.findOne({
        where: { email },
        relations: this.getRelationOptions(options),
      });

      if (!userEntity) return null;

      const dominUser = userEntity.toDomain();

      if (options?.group && userEntity.group) {
        const group = await this.findGroupWithHierarchy(userEntity.group.id);
        if (group) {
          dominUser.group = group;
        }
      }

      return dominUser;
    } catch (error) {
      throw this.handleDatabaseError(error);
    }
  }

  async findUserById(
    id: string,
    options?: FindUserOptions,
  ): Promise<User | null> {
    try {
      const userEntity = await this.userRepository.findOne({
        where: { id },
        relations: this.getRelationOptions(options),
      });

      if (!userEntity) return null;

      const dominUser = userEntity.toDomain();

      if (options?.group && userEntity.group) {
        const group = await this.findGroupWithHierarchy(userEntity.group.id);
        if (group) {
          dominUser.group = group;
        }
      }

      return dominUser;
    } catch (error) {
      throw this.handleDatabaseError(error);
    }
  }

  private async findUserWithGroup(id: string, options?: FindUserOptions) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: this.getRelationOptions(options),
    });

    if (!user?.group) return null;

    const group = await this.findGroupWithHierarchy(user.group.name);
    if (!group) return null;
    const domainUser = user.toDomain();
    domainUser.group = group;
    return domainUser;
  }
  private async findGroupWithHierarchy(id?: string): Promise<Group | null> {
    if (!id) return null;
    return this.groupRepository.getById(id);
  }

  private handleDatabaseError(error: unknown): DomainError | DatabaseError {
    if (error instanceof DomainError) {
      return error;
    }
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

  private getRelationOptions(options?: FindUserOptions): string[] {
    const relationKeys = ['group', 'role'];
    const relations: string[] = [];
    if (options) {
      for (const key of relationKeys) {
        if (options[key]) {
          relations.push(key);
        }
      }
    }
    return relations;
  }
}

import { Injectable } from '@nestjs/common';
import { User } from '../entities/user/user.entity';
import { Role } from '@domain/entities/role/role.entity';
import { Group } from '@domain/entities/group/group.entity';

export type SaveUserParams = {
  name: string;
  email: string;
  password: string;
  organizationId: string;
  group: Group;
  role: Role;
};

export type FindUserOptions = {
  group?: boolean;
  role?: boolean;
};

@Injectable()
export abstract class UserRepository {
  abstract create(user: SaveUserParams): Promise<User>;
  abstract findUserByEmail(
    email: string,
    options?: FindUserOptions,
  ): Promise<User | null>;
  abstract findUserById(
    id: string,
    options?: FindUserOptions,
  ): Promise<User | null>;
}

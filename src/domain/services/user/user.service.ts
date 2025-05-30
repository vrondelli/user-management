import { User } from '@domain/entities/user/user.entity';
import {
  UserAlreadyExistsError,
  UserCannotAssignRoleError,
  UserMisconfiguredError,
  UserNotFoundByEmailError,
  UserNotFoundByIdError,
} from '@domain/error/user.error';
import {
  FindUserOptions,
  SaveUserParams,
  UserRepository,
} from '@domain/repositories/user.repository';
import { Inject, Injectable } from '@nestjs/common';
import { Role } from '@domain/entities/role/role.entity';
import { RoleService } from '../role/role.service';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { GroupRepository } from '@domain/repositories/group.repository';
import { Group } from '@domain/entities/group/group.entity';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly roleService: RoleService,
    private readonly groupRepository: GroupRepository,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async createUser(userData: SaveUserParams): Promise<User> {
    const user = await this.userRepository.create(userData);
    await this.cacheUser(user);
    return user;
  }

  async validateUserExistsByEmail(email: string): Promise<void> {
    const user = await this.userRepository.findUserByEmail(email);
    if (user) throw new UserAlreadyExistsError(email);
  }

  async getUserById(
    id: string,
    cached = true,
    options?: FindUserOptions,
  ): Promise<User> {
    if (cached) {
      const cachedUser = await this.getCachedUser(id);
      if (cachedUser) return cachedUser;
    }
    const user = await this.userRepository.findUserById(id, options);
    if (!user) throw new UserNotFoundByIdError(id);
    return user;
  }

  async getUserByEmail(
    email: string,
    options?: FindUserOptions,
  ): Promise<User> {
    const user = await this.userRepository.findUserByEmail(email, options);
    console.log(user);
    if (!user) throw new UserNotFoundByEmailError(email);
    return user;
  }

  async validateUserCanAssignRole(
    userId: string,
    role: string,
  ): Promise<{
    role: Role;
    user: User;
  }> {
    const user = await this.getUserById(userId, false, {
      group: true,
    });
    const roleEntity = await this.roleService.getRoleByName(role);
    if (!user.canAssignRole(roleEntity)) {
      throw new UserCannotAssignRoleError(userId, role);
    }
    return { role: roleEntity, user };
  }

  async getNewUserGroup(creatorUser: User): Promise<Group> {
    const groupName = creatorUser.getNewUserGroup();
    console.log('Group name:', groupName);
    const group = await this.groupRepository.getByName(groupName);
    if (!group) {
      throw new UserMisconfiguredError();
    }
    return group;
  }

  private assembleCacheKey(userId: string): string {
    return `user:${userId}`;
  }

  private async cacheUser(user: User): Promise<void> {
    await this.cacheManager.set(this.assembleCacheKey(user.id), user);
  }

  private async getCachedUser(userId: string): Promise<User | null> {
    const user = await this.cacheManager.get<User>(
      this.assembleCacheKey(userId),
    );
    return user;
  }
}

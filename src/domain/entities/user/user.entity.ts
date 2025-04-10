import { Group } from '../group/group.entity';
import { Role } from '../role/role.entity';

export class User {
  public readonly id: string;
  public name: string;
  public email: string;
  public password: string;
  public role: Role;
  public group?: Group;
  public organizationId: string;
  public createdAt: string;
  public updatedAt?: string;

  private readonly defaultUserGroupName = 'default';

  constructor({
    id,
    name,
    email,
    password,
    role,
    group,
    organizationId,
    createdAt,
    updatedAt,
  }: {
    id: string;
    name: string;
    email: string;
    password: string;
    organizationId: string;
    group?: Group;
    role: Role;
    createdAt: string;
    updatedAt?: string;
  }) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.organizationId = organizationId;
    this.role = role;
    this.group = group;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  canAssignRole(targetRole: Role): boolean {
    return this.role.hasAllPermissions(targetRole.permissions);
  }

  getSessionTime(): number | undefined {
    return this.group?.getConfig().sessionTime;
  }

  getNewUserGroup(): string {
    return (
      this.group?.getConfig().newUserGroupName || this.defaultUserGroupName
    );
  }
}

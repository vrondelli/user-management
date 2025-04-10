import { Permission } from '../permission/permission.entity';

export class Role {
  constructor(
    public readonly id: string,
    public name: string,
    public permissions: Permission[] = [],
    public createdAt: string,
    public description?: string,
    public updatedAt?: string,
  ) {}

  getPermissionNames(): string[] {
    return this.permissions.map((p) => p.name);
  }

  hasPermission(permission: Permission): boolean {
    return this.permissions.some((granted) => granted.match(permission.name));
  }

  hasAllPermissions(required: Permission[]): boolean {
    return required.every((requiredPerm) => this.hasPermission(requiredPerm));
  }
}

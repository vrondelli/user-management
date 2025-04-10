/**
 * Represents a permission entity with a specific naming convention and matching logic.
 *
 * ✅ **Permission String Format**
 * The permission name follows this pattern:
 * `microserviceName.permissionLevel.functionName`
 *
 * ✅ **Wildcards Supported**
 * Each part of the permission string can use the `*` wildcard:
 * - `*.*.*` — full access
 * - `users.*.*` — full access to the users microservice
 * - `users.read.*` — read access to all functions in users
 * - `users.write.createUser` — only permission to createUser in users
 *
 * @example
 * ```typescript
 * const permission = new Permission('1', 'users.read.getUser', '2023-01-01');
 * console.log(permission.match('users.read.*')); // true
 * console.log(permission.match('users.write.*')); // false
 * ```
 */
export class Permission {
  constructor(
    public readonly id: string,
    public name: string,
    public createdAt: string,
    public description?: string,
  ) {}

  public match(required: string): boolean {
    const grantedParts = this.name.split('.');
    const requiredParts = required.split('.');

    for (let i = 0; i < requiredParts.length; i++) {
      const grantedPart = grantedParts[i];
      const requiredPart = requiredParts[i];

      if (!grantedPart) return false;
      if (grantedPart === '*') return true;
      if (grantedPart !== requiredPart) return false;
    }

    return grantedParts.length <= requiredParts.length;
  }
}

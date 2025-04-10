export class PermissionCheckerService {
  static match(grantedPermission: string, required: string): boolean {
    const grantedParts = grantedPermission.split('.');
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

  static hasRequiredPermission(
    grantedPermissions: string[],
    requiredPermission: string,
  ): boolean {
    if (grantedPermissions.length === 0) {
      return false;
    }

    return grantedPermissions.some((permission) =>
      this.match(permission, requiredPermission),
    );
  }
}

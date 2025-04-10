import { SetMetadata } from '@nestjs/common';

export const REQUIRED_PERMISSIONS_KEY = 'required_permission';

export const RequirePermission = (permission: string) =>
  SetMetadata(REQUIRED_PERMISSIONS_KEY, permission);

import { DomainError } from '@framework/errors/domain.error';
import { ErrorReason } from '@framework/errors/error-reason';
import { ErrorDecorator } from '@framework/errors/error.decorator';

@ErrorDecorator(DomainError)
export class RoleNotFoundError extends DomainError {
  constructor(roleName: string) {
    super(
      `Role ${roleName} not found`,
      ErrorReason.BUSINESS_RULES,
      'ROLE_NOT_FOUND',
    );
  }
}

@ErrorDecorator(DomainError)
export class RoleNotAssignebleError extends DomainError {
  constructor(roleName: string) {
    super(
      `Role ${roleName} not assignable`,
      ErrorReason.BUSINESS_RULES,
      'ROLE_NOT_ASSIGNABLE',
    );
  }
}

import { DomainError } from '@framework/errors/domain.error';
import { ErrorReason } from '@framework/errors/error-reason';
import { ErrorDecorator } from '@framework/errors/error.decorator';

@ErrorDecorator(DomainError)
export class UserAlreadyExistsError extends DomainError {
  constructor(email: string) {
    super(
      `User with email ${email} already exists`,
      ErrorReason.BUSINESS_RULES,
      'USER_ALREADY_EXISTS',
    );
  }
}

@ErrorDecorator(DomainError)
export class UserNotFoundError extends DomainError {
  constructor(findKey: string, email: string) {
    super(
      `User with ${findKey} ${email} not found`,
      ErrorReason.BUSINESS_RULES,
      'USER_NOT_FOUND',
    );
  }
}

@ErrorDecorator(DomainError)
export class UserNotFoundByIdError extends UserNotFoundError {
  constructor(id: string) {
    super('id', id);
  }
}

@ErrorDecorator(DomainError)
export class UserNotFoundByEmailError extends UserNotFoundError {
  constructor(email: string) {
    super('email', email);
  }
}

@ErrorDecorator(DomainError)
export class UserCannotAssignRoleError extends DomainError {
  constructor(userId: string, roleName: string) {
    super(
      `User ${userId} cannot assign role ${roleName}`,
      ErrorReason.BUSINESS_RULES,
      'USER_CANNOT_ASSIGN_ROLE',
    );
  }
}

@ErrorDecorator(DomainError)
export class UserMisconfiguredError extends DomainError {
  constructor() {
    super(
      'User is misconfigured. Please contact support.',
      ErrorReason.BUSINESS_RULES,
      'USER_MISCONFIGURED',
    );
  }
}

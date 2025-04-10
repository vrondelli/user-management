import { DomainError } from '@framework/errors/domain.error';
import { ErrorReason } from '@framework/errors/error-reason';
import { ErrorDecorator } from '@framework/errors/error.decorator';

@ErrorDecorator(DomainError)
export class InvalidCredentialsError extends DomainError {
  constructor() {
    super(
      'Email or password are invalid.',
      ErrorReason.AUTHENTICATION,
      'INVALID_CREDENTIALS',
    );
  }
}

@ErrorDecorator(DomainError)
export class SessionNotFoundError extends DomainError {
  constructor(sessionId: string) {
    super(
      `Session with id ${sessionId} not found.`,
      ErrorReason.AUTHENTICATION,
      'SESSION_NOT_FOUND',
    );
  }
}

@ErrorDecorator(DomainError)
export class InvalidExpiredSessionError extends DomainError {
  constructor() {
    super(
      'Session has expired.',
      ErrorReason.AUTHENTICATION,
      'SESSION_EXPIRED',
    );
  }
}

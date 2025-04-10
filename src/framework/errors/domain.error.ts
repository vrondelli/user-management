import { ErrorReason } from './error-reason';

export class DomainError extends Error {
  constructor(message: string, reason: ErrorReason, code?: string) {
    super();
    this.message = message;
    this.reason = reason;
    this.code = code;
  }

  public readonly message: string;
  public readonly reason: ErrorReason;
  public readonly code?: string;
}

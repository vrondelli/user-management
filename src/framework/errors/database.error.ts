import { ErrorReason } from './error-reason';

export class DatabaseError extends Error {
  constructor(message: string, reason: ErrorReason) {
    super();
    this.message = message;
    this.reason = reason;
  }

  public readonly message: string;
  public readonly reason: ErrorReason;
}

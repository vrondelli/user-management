import { QueryActions } from '../use-cases/query.use-case';
import { DomainError } from './domain.error';
import { ErrorReason } from './error-reason';
import { ErrorResponse } from './error-response';

export class QueryErrorHandler {
  constructor(
    private readonly entity: string,
    private readonly action: QueryActions,
  ) {}

  private isKnownError(error: any): boolean {
    return error instanceof DomainError || error instanceof ErrorResponse;
  }

  handle(error: any) {
    if (this.isKnownError(error)) {
      throw error;
    }
    throw new DomainError(
      `Failed to ${this.action} ${this.entity.toLocaleLowerCase()}`,
      ErrorReason.INTERNAL_SERVER_ERROR,
    );
  }
}

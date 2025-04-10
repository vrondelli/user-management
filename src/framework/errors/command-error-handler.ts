import { CommandActions } from '../responses/command.response';
import { DomainError } from './domain.error';
import { ErrorReason } from './error-reason';
import { ErrorResponse } from './error-response';
import { Logger } from '@nestjs/common';
import { DatabaseError } from './database.error';

export class CommandErrorHandler {
  private readonly entity: string;
  private readonly action: CommandActions;
  private readonly logger: Logger;

  constructor(entity: string, action: CommandActions, logger: Logger) {
    this.entity = entity;
    this.action = action;
    this.logger = logger;
  }
  private isKnownError(error: any): boolean {
    return (
      error instanceof DomainError ||
      error instanceof ErrorResponse ||
      error instanceof DatabaseError
    );
  }

  handle(error: any) {
    console.log(error);
    this.logger.error('Command use case failed with error: ', error.message);
    if (this.isKnownError(error)) {
      throw error;
    }

    throw new DomainError(
      `Failed to ${this.action} ${this.entity.toLocaleLowerCase()}`,
      ErrorReason.INTERNAL_SERVER_ERROR,
    );
  }
}

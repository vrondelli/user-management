import { Injectable } from '@nestjs/common';
import { SessionService } from '@domain/services/session/session.service';
import { CommandUseCase } from '@framework/use-cases/command.use-case';
import { Session } from '@domain/entities/session/session.entity';
import {
  CommandActions,
  CommandResponse,
} from '@framework/responses/command.response';
import { InvalidExpiredSessionError } from '@domain/error/auth.error';

export type AuthorizeParams = {
  sessionId: string;
};

export type AuthorizeResponsePayload = {
  session: Session;
};

export type AuthorizeResponse = CommandResponse<AuthorizeResponsePayload>;

@Injectable()
export class Authorize extends CommandUseCase<
  AuthorizeParams,
  AuthorizeResponsePayload
> {
  static entity = 'Authorization';
  static action = CommandActions.CREATE;

  constructor(private readonly sessionService: SessionService) {
    super(Authorize);
  }

  async execute(params: AuthorizeParams): Promise<AuthorizeResponse> {
    const session = await this.sessionService.getSessionById(params.sessionId);

    if (!session || session.isExpired()) {
      throw new InvalidExpiredSessionError();
    }

    const updatedSession =
      await this.sessionService.updateExpirationTime(session);

    return this.respondWithSuccess({ session: updatedSession });
  }
}

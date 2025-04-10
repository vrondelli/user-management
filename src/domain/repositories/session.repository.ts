import { Session } from '@domain/entities/session/session.entity';

export abstract class SessionRepository {
  abstract createSession(session: Session): Promise<Session>;
  abstract getSessionById(sessionId: string): Promise<Session | null>;
  abstract updateSession(
    sessionId: string,
    sessionData: Partial<Session>,
  ): Promise<Session>;
}

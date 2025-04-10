import { Session } from '@domain/entities/session/session.entity';
import { User } from '@domain/entities/user/user.entity';
import { SessionRepository } from '@domain/repositories/session.repository';
import { Injectable } from '@nestjs/common';

import { v4 as uuid } from 'uuid';

@Injectable()
export class SessionService {
  constructor(private readonly sessionRepository: SessionRepository) {}

  public createSession(
    user: User,
    requestInfo: { ip?: string; userAgent?: string; device?: string } = {},
  ): Promise<Session> {
    console.log(user);
    const sessionTime = user.getSessionTime() || Session.defaultSessionTime;
    const session = Session.create({
      id: uuid(),
      user,
      role: user.role,
      sessionTime,
      ...requestInfo,
    });
    return this.sessionRepository.createSession(session);
  }

  public getSessionById(sessionId: string): Promise<Session | null> {
    return this.sessionRepository.getSessionById(sessionId);
  }

  public async updateExpirationTime(session: Session): Promise<Session> {
    const expiresAt = session.updateExpirationTime();
    const updateData = {
      expiresAt,
    };

    return this.sessionRepository.updateSession(session.id, updateData);
  }
}

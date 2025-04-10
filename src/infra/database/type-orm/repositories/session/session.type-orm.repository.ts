import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SessionRepository } from '@domain/repositories/session.repository';
import { Session } from '@domain/entities/session/session.entity';
import { SessionEntity } from '../../models/session.type-orm.entity';
import { DatabaseError } from '@framework/errors/database.error';
import { DomainError } from '@framework/errors/domain.error';
import { ErrorReason } from '@framework/errors/error-reason';
import { SessionNotFoundError } from '@domain/error/auth.error';

@Injectable()
export class SessionTypeOrmRepository extends SessionRepository {
  constructor(
    @InjectRepository(SessionEntity)
    private readonly sessionRepository: Repository<SessionEntity>,
  ) {
    super();
  }

  async createSession(session: Session): Promise<Session> {
    try {
      const sessionEntity = this.sessionRepository.create(
        SessionEntity.fromDomain(session),
      );
      console.log(sessionEntity);
      const savedSession = await this.sessionRepository.save(sessionEntity);
      return savedSession.toDomain();
    } catch (error) {
      console.log(error);
      throw this.handleDatabaseError(error);
    }
  }

  async getSessionById(sessionId: string): Promise<Session | null> {
    try {
      const sessionEntity = await this.sessionRepository.findOne({
        where: { id: sessionId },
      });
      return sessionEntity ? sessionEntity.toDomain() : null;
    } catch (error) {
      throw this.handleDatabaseError(error);
    }
  }

  async updateSession(
    sessionId: string,
    sessionData: Partial<Session>,
  ): Promise<Session> {
    try {
      const sessionEntity = await this.sessionRepository.findOne({
        where: { id: sessionId },
      });

      if (!sessionEntity) {
        throw new SessionNotFoundError(sessionId);
      }

      Object.assign(sessionEntity, sessionData);
      const updatedSession = await this.sessionRepository.save(sessionEntity);
      return updatedSession.toDomain();
    } catch (error) {
      throw this.handleDatabaseError(error);
    }
  }

  private handleDatabaseError(error: unknown): DomainError | DatabaseError {
    if (error instanceof DomainError) {
      return error;
    }
    return new DatabaseError(
      JSON.stringify(error, null, 2),
      ErrorReason.INTERNAL_SERVER_ERROR,
    );
  }
}

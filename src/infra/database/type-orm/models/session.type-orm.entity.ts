import { UserEntity } from './user.type-orm.entity';
import { RoleEntity } from './role.type-orm.entity';
import { Session as DomainSession } from '@domain/entities/session/session.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity('sessions')
export class SessionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserEntity, { eager: true })
  user: UserEntity;

  @ManyToOne(() => RoleEntity, { eager: true })
  role: RoleEntity;

  @Column({
    type: 'bigint',
    transformer: {
      to: (value: number) => value,
      from: (value: string) => Number(value),
    },
  })
  expiresAt: number;

  @Column({ nullable: true })
  ip?: string;

  @Column({ nullable: true })
  userAgent?: string;

  @Column({ nullable: true })
  device?: string;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: string;

  @Column()
  sessionTime: number;

  toDomain(): DomainSession {
    console.log(typeof this.expiresAt);
    return new DomainSession({
      id: this.id,
      user: this.user.toDomain(),
      role: this.role.toDomain(),
      expiresAt: this.expiresAt,
      ip: this.ip,
      userAgent: this.userAgent,
      device: this.device,
      createdAt: this.createdAt,
      sessionTime: this.sessionTime,
    });
  }

  static fromDomain(domainSession: DomainSession): SessionEntity {
    const entity = new SessionEntity();
    entity.id = domainSession.id;
    entity.user = UserEntity.fromDomain(domainSession.user);
    entity.role = RoleEntity.fromDomain(domainSession.role);
    entity.expiresAt = domainSession.expiresAt;
    entity.ip = domainSession.ip;
    entity.userAgent = domainSession.userAgent;
    entity.device = domainSession.device;
    entity.sessionTime = domainSession.sessionTime;
    return entity;
  }
}

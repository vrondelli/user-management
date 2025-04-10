import { Role } from '../role/role.entity';
import { User } from '../user/user.entity';

export class Session {
  public readonly id: string;

  public readonly user: User;

  public readonly role: Role;

  // The expiration time in milliseconds since the Unix epoch
  public expiresAt: number;

  public readonly ip?: string;

  public readonly userAgent?: string;

  public readonly device?: string;

  public readonly createdAt?: string;

  public readonly sessionTime: number;

  static defaultSessionTime = 60 * 5 * 1000; // 5 minutes

  constructor({
    id,
    user,
    role,
    ip,
    userAgent,
    device,
    createdAt,
    sessionTime,
    expiresAt,
  }: {
    id: string;
    user: User;
    role: Role;
    ip?: string;
    userAgent?: string;
    device?: string;
    createdAt?: string;
    sessionTime?: number;
    expiresAt: number;
  }) {
    this.id = id;
    this.user = user;
    this.role = role;
    this.sessionTime = sessionTime || Session.defaultSessionTime;
    this.createdAt = createdAt;
    this.ip = ip;
    this.userAgent = userAgent;
    this.device = device;
    this.expiresAt = expiresAt;
  }

  static create({
    id,
    user,
    role,
    sessionTime = 60 * 5 * 1000,
    ip,
    userAgent,
    device,
  }: {
    id: string;
    user: User;
    role: Role;
    ip?: string;
    userAgent?: string;
    device?: string;
    sessionTime?: number;
  }): Session {
    const expiresAt =
      new Date().getTime() + (sessionTime || Session.defaultSessionTime);
    return new Session({
      id,
      user,
      role,
      ip,
      sessionTime,
      userAgent,
      device,
      expiresAt,
    });
  }

  public isExpired(): boolean {
    const now = new Date().getTime();
    return now > this.expiresAt;
  }

  public updateExpirationTime(): number {
    this.expiresAt = new Date().getTime() + this.sessionTime;
    return this.expiresAt;
  }
}

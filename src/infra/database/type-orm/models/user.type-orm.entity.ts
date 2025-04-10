import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { RoleEntity } from './role.type-orm.entity';
import { User as DomainUser } from '@domain/entities/user/user.entity';
import { GroupTypeOrmEntity } from './group.type-orm.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @ManyToOne(() => RoleEntity, (role) => role.users, { eager: true })
  role: RoleEntity;

  @ManyToOne(() => GroupTypeOrmEntity, (group) => group.users)
  group?: GroupTypeOrmEntity;

  @Column()
  organizationId: string;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: string;

  @Column({ default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt?: string;

  toDomain(): DomainUser {
    console.log(this);
    return new DomainUser({
      id: this.id,
      organizationId: this.organizationId,
      name: this.name,
      email: this.email,
      password: this.password,
      group: this.group?.toDomain(),
      role: this.role.toDomain(),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    });
  }

  static fromDomain(domainUser: DomainUser): UserEntity {
    const entity = new UserEntity();
    entity.id = domainUser.id;
    entity.name = domainUser.name;
    entity.email = domainUser.email;
    entity.password = domainUser.password;
    entity.role = RoleEntity.fromDomain(domainUser.role);
    entity.organizationId = domainUser.organizationId;
    entity.group = domainUser.group
      ? GroupTypeOrmEntity.fromDomain(domainUser.group)
      : undefined;
    entity.createdAt = domainUser.createdAt;
    entity.updatedAt = domainUser.updatedAt;
    return entity;
  }
}

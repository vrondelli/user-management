import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { UserEntity } from './user.type-orm.entity';
import { PermissionEntity } from './permission.type-orm.entity';
import { Role as DomainRole } from '@domain/entities/role/role.entity';

@Entity('roles')
export class RoleEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description?: string;

  @OneToMany(() => UserEntity, (user) => user.role)
  users: UserEntity[];

  @ManyToMany(() => PermissionEntity, { eager: true })
  @JoinTable({
    name: 'role_permissions',
    joinColumn: { name: 'role_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'permission_id', referencedColumnName: 'id' },
  })
  permissions: PermissionEntity[];

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: string;

  @Column({ default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt?: string;

  toDomain(): DomainRole {
    return new DomainRole(
      this.id,
      this.name,
      this.permissions?.map((permission) => permission.toDomain()) || [],
      this.createdAt,
      this.description,
      this.updatedAt,
    );
  }

  static fromDomain(domainRole: DomainRole): RoleEntity {
    const entity = new RoleEntity();
    entity.id = domainRole.id;
    entity.name = domainRole.name;
    entity.permissions = domainRole.permissions.map(
      PermissionEntity.fromDomain,
    );
    entity.description = domainRole.description;
    entity.createdAt = domainRole.createdAt;
    entity.updatedAt = domainRole.updatedAt;

    return entity;
  }
}

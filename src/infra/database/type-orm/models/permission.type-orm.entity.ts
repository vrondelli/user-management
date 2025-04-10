import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { RoleEntity } from './role.type-orm.entity';
import { Permission as DomainPermission } from '@domain/entities/permission/permission.entity';

@Entity('permissions')
export class PermissionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: string;

  @ManyToMany(() => RoleEntity, (role) => role.permissions)
  roles: RoleEntity[];

  toDomain(): DomainPermission {
    return new DomainPermission(
      this.id,
      this.name,
      this.createdAt,
      this.description,
    );
  }

  static fromDomain(domainPermission: DomainPermission): PermissionEntity {
    const entity = new PermissionEntity();
    entity.id = domainPermission.id;
    entity.name = domainPermission.name;
    entity.description = domainPermission.description;
    entity.createdAt = domainPermission.createdAt;
    return entity;
  }
}

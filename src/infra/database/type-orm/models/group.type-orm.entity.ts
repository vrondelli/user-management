import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';

import { UserEntity as UserTypeOrmEntity } from './user.type-orm.entity';
import { Group } from '@domain/entities/group/group.entity';

@Entity('groups')
export class GroupTypeOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('jsonb', { default: {} })
  config: Record<string, any>;

  @ManyToOne(() => GroupTypeOrmEntity, (group) => group.children, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  parent?: GroupTypeOrmEntity;

  @OneToMany(() => GroupTypeOrmEntity, (group) => group.parent)
  children: GroupTypeOrmEntity[];

  @OneToMany(() => UserTypeOrmEntity, (user) => user.group)
  users: UserTypeOrmEntity[];

  toDomain(): Group {
    return new Group({
      id: this.id,
      name: this.name,
      config: this.config,
      parent: this.parent ? this.parent.toDomain() : undefined,
    });
  }

  static fromDomain(domainGroup: Group): GroupTypeOrmEntity {
    const entity = new GroupTypeOrmEntity();
    entity.id = domainGroup.id;
    entity.name = domainGroup.name;
    entity.config = domainGroup.config;
    entity.parent = domainGroup.parent
      ? GroupTypeOrmEntity.fromDomain(domainGroup.parent)
      : undefined;
    return entity;
  }
}

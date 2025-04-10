import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserEntity } from './type-orm/models/user.type-orm.entity';
import { RoleEntity } from './type-orm/models/role.type-orm.entity';
import { PermissionEntity } from './type-orm/models/permission.type-orm.entity';
import { UserTypeOrmRepository } from './type-orm/repositories/user/user.type-orm.repository';
import { RoleTypeOrmRepository } from './type-orm/repositories/role/role.type-orm.repository';
import { UserRepository } from '@domain/repositories/user.repository';
import { RoleRepository } from '@domain/repositories/role.repository';
import { SessionEntity } from './type-orm/models/session.type-orm.entity';
import { SessionRepository } from '@domain/repositories/session.repository';
import { SessionTypeOrmRepository } from './type-orm/repositories/session/session.type-orm.repository';
import { Group } from '@domain/entities/group/group.entity';
import TypeOrmConfig from './type-orm/type-orm.config';
import { EntitySchema } from 'typeorm';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.getOrThrow('app.database.clientUrl'),
        entities: TypeOrmConfig.entities,
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([
      ...(TypeOrmConfig.entities as EntitySchema<any>[]),
    ]),
  ],
  providers: [
    { provide: UserRepository, useClass: UserTypeOrmRepository },
    { provide: RoleRepository, useClass: RoleTypeOrmRepository },
    { provide: SessionRepository, useClass: SessionTypeOrmRepository },
  ],
  exports: [UserRepository, RoleRepository, SessionRepository],
})
export class DatabaseModule {}

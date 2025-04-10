import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { PermissionEntity } from './models/permission.type-orm.entity';
import { RoleEntity } from './models/role.type-orm.entity';
import { UserEntity } from './models/user.type-orm.entity';
import { SessionEntity } from './models/session.type-orm.entity';
import { GroupTypeOrmEntity } from './models/group.type-orm.entity';

const TypeOrmConfig: PostgresConnectionOptions = {
  type: 'postgres',
  url:
    process.env.DATABASE_URL ||
    'postgres://user_management:123456@localhost:5432/user_management_db',
  entities: [
    UserEntity,
    RoleEntity,
    PermissionEntity,
    SessionEntity,
    GroupTypeOrmEntity,
  ],
  migrations: ['src/infra/database/type-orm/migrations/*.ts'],
  synchronize: false,
};

export default TypeOrmConfig;

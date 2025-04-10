import { AppDataSource } from '@infra/database/type-orm/data-source.type-orm';
import { UserEntity } from '@infra/database/type-orm/models/user.type-orm.entity';
import { RoleEntity } from '@infra/database/type-orm/models/role.type-orm.entity';
import { GroupTypeOrmEntity } from '@infra/database/type-orm/models/group.type-orm.entity';
import * as bcrypt from 'bcrypt';

async function createInitialUsers() {
  try {
    await AppDataSource.initialize();
    console.log('Data source has been initialized.');

    const roleRepository = AppDataSource.getRepository(RoleEntity);
    const groupRepository = AppDataSource.getRepository(GroupTypeOrmEntity);

    const adminRole = await roleRepository.findOneBy({ name: 'admin' });
    const userRole = await roleRepository.findOneBy({ name: 'basic_user' });
    if (!adminRole || !userRole) {
      throw new Error('"admin" or "basic_user role" not found.');
    }

    const defaultGroup = await groupRepository.findOneBy({
      name: 'default',
    });

    const userGroup = await groupRepository.findOneBy({
      name: 'users',
    });
    if (!defaultGroup || !userGroup) {
      throw new Error('Default group "default" or "user" not found.');
    }

    const userRepository = AppDataSource.getRepository(UserEntity);

    const initialUsers = [
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: await bcrypt.hash('password@123', 10),
        role: adminRole,
        group: defaultGroup,
        organizationId: 'org-123',
      },
      {
        name: 'Regular User',
        email: 'user@example.com',
        password: await bcrypt.hash('password@123', 10),
        role: adminRole,
        group: userGroup,
        organizationId: 'org-123',
      },
    ];

    for (const userData of initialUsers) {
      const user = userRepository.create(userData);
      await userRepository.save(user);
      console.log(`User ${user.name} created with email ${user.email}`);
    }

    console.log('Initial users created successfully.');
  } catch (error) {
    console.error('Error creating initial users:', error);
  } finally {
    await AppDataSource.destroy();
    console.log('Data source has been destroyed.');
  }
}

createInitialUsers();

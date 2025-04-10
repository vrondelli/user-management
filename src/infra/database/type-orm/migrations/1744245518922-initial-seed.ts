import { BcryptCryptoService } from '@infra/crypto/bcrypt/bcrypt-crypto.service';
import { MigrationInterface, QueryRunner } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

export class InitialSeed1744245518922 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Generate UUIDs for permissions
    const permissions = [
      {
        id: uuidv4(),
        name: 'user-management.basic.createUser',
        description: 'Permission to create users',
      },
      {
        id: uuidv4(),
        name: 'user-management.basic.listUsers',
        description: 'Permission to list users',
      },
    ];

    for (const permission of permissions) {
      await queryRunner.query(
        `INSERT INTO permissions (id, name, description, "createdAt") VALUES ($1, $2, $3, CURRENT_TIMESTAMP)`,
        [permission.id, permission.name, permission.description],
      );
    }

    // Generate UUIDs for roles
    const roles = [
      { id: uuidv4(), name: 'admin', description: 'Administrator role' },
      { id: uuidv4(), name: 'basic_user', description: 'Regular user role' },
    ];

    // Insert roles
    for (const role of roles) {
      await queryRunner.query(
        `INSERT INTO roles (id, name, description, "createdAt") VALUES ($1, $2, $3, CURRENT_TIMESTAMP)`,
        [role.id, role.name, role.description],
      );
    }

    // Link roles to permissions
    const rolePermissions = [
      { roleId: roles[0].id, permissionId: permissions[0].id },
      { roleId: roles[0].id, permissionId: permissions[1].id },
      { roleId: roles[1].id, permissionId: permissions[1].id },
    ];

    for (const rolePermission of rolePermissions) {
      await queryRunner.query(
        `INSERT INTO role_permissions (role_id, permission_id) VALUES ($1, $2)`,
        [rolePermission.roleId, rolePermission.permissionId],
      );
    }

    // Generate UUID for group
    const defaulGroupId = uuidv4();

    // Insert groups
    await queryRunner.query(
      `INSERT INTO groups (id, name, config) VALUES ($1, $2, $3)`,
      [defaulGroupId, 'default', { sessionTime: 60 * 15 * 1000 }],
    );

    const userGroupId = uuidv4();
    await queryRunner.query(
      `INSERT INTO groups (id, name, config, "parentId") VALUES ($1, $2, $3, $4)`,
      [userGroupId, 'users', { sessionTime: 60 * 10 * 1000 }, defaulGroupId],
    );

    console.log('default Group created:', defaulGroupId);
    console.log('user Group created:', userGroupId);
    console.log('admin role created:', roles[0].id);
    console.log('basic_user role created:', roles[1].id);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Delete users
    await queryRunner.query(`DELETE FROM users`);

    // Delete groups
    await queryRunner.query(`DELETE FROM groups`);

    // Delete role_permissions
    await queryRunner.query(`DELETE FROM role_permissions`);

    // Delete roles
    await queryRunner.query(`DELETE FROM roles`);

    // Delete permissions
    await queryRunner.query(`DELETE FROM permissions`);
  }
}

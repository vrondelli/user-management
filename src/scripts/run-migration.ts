import { execSync } from 'child_process';

const dataSource = 'src/infra/database/type-orm/data-source.type-orm.ts';
const command = `ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:run -d ${dataSource}`;

console.log(`Running migration`);
try {
  execSync(command, { stdio: 'inherit' });
  console.log('✅ Migration ran successfully.');
} catch (error) {
  console.error('❌ Failed to run migration:', error);
  process.exit(1);
}

import { execSync } from 'child_process';

const args = process.argv.slice(2);

if (args.length === 0) {
  console.error(
    '❌ Please provide a migration name.\nExample: npm run migration:generate CreateUserTable',
  );
  process.exit(1);
}

const name = args[0];

const dataSource = 'src/infra/database/type-orm/data-source.type-orm.ts';
const outputDir = 'src/infra/database/type-orm/migrations';
const command = `ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:generate -d ${dataSource} ${outputDir}/${name}`;

console.log(`Generating migration: ${name}`);
try {
  execSync(command, { stdio: 'inherit' });
  console.log('✅ Migration generated successfully.');
} catch (error) {
  console.error('❌ Failed to generate migration:', error);
  process.exit(1);
}

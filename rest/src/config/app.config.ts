import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  appPort: Number(process.env.APP_PORT) || 3000,
  jwt: {
    secret:
      process.env.JWT_SECRET || Buffer.from('secretKey').toString('base64'),
  },
  database: {
    clientUrl:
      process.env.DATABASE_URL ||
      'postgres://user_management:123456@localhost:5432/user_management_db',
  },
}));

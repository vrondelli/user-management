import { AuthApplicationModule } from '@application/auth/auth.module';
import { LocalAuthProvider } from '@application/auth/local-auth-user.provider';
import { UserModule } from '@application/user/user.module';
import { AuthModule } from '@framework/auth/auth.module';
import { AuthProvider } from '@framework/auth/providers/auth-user.provider';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserController } from '@presentation/user/user.controller';
import { create as createRedisStore } from 'cache-manager-ioredis';
import appConfig from './config/app.config';

@Module({
  imports: [
    UserModule,
    AuthApplicationModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
    }),
    AuthModule.registerAsync({
      imports: [AuthApplicationModule],
      authProvider: {
        provide: AuthProvider,
        useExisting: LocalAuthProvider,
      },
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => ({
        store: await createRedisStore({
          host: 'localhost',
          port: 6379,
          ttl: 60, // seconds
        }),
      }),
    }),
  ],
  controllers: [UserController],
  providers: [],
})
export class AppModule {}

// auth.module.ts
import {
  Module,
  DynamicModule,
  Type,
  Provider,
  FactoryProvider,
} from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthProvider } from '@framework/auth/providers/auth-user.provider';
import { JwtService } from '@framework/auth/services/jwt.service';

export type RegisterAuthModuleOptions = {
  authProvider: Provider<AuthProvider>;
  imports?: Type<any>[];
};

@Module({})
export class AuthModule {
  static registerAsync(options: RegisterAuthModuleOptions): DynamicModule {
    return {
      global: true,
      module: AuthModule,
      imports: [
        ...(options.imports || []),
        ConfigModule,
        JwtModule.registerAsync({
          imports: [ConfigModule],
          useFactory: (configService: ConfigService) => ({
            secret: configService.getOrThrow('app.jwt.secret'),
          }),
          inject: [ConfigService],
        }),
      ],
      providers: [JwtService, options.authProvider],
      exports: [JwtService, options.authProvider],
    };
  }
}

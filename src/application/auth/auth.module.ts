import { Module } from '@nestjs/common';
import { DomainModule } from '@domain/domain.module';
import { Login } from './use-cases/login.use-case';
import { Authorize } from './use-cases/authorize.use-case';
import { CryptoModule } from '@infra/crypto/crypto.module';
import { LocalAuthProvider } from './local-auth-user.provider';
import { AuthModule } from '@framework/auth/auth.module';

const providers = [Login, Authorize, LocalAuthProvider];

@Module({
  exports: [...providers],
  imports: [DomainModule, CryptoModule, AuthModule],
  providers,
})
export class AuthApplicationModule {}

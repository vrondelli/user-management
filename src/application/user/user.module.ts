import { Module } from '@nestjs/common';
import { CreateUser } from './use-cases/create-user/create-user.use-case';
import { DomainModule } from '@domain/domain.module';
import { CryptoModule } from '@infra/crypto/crypto.module';
import { DatabaseModule } from '@infra/database/database.module';

const useCases = [CreateUser];

@Module({
  providers: useCases,
  exports: useCases,
  imports: [DomainModule, CryptoModule, DatabaseModule],
})
export class UserModule {}

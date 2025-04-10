import { Module } from '@nestjs/common';
import { UserService } from './services/user/user.service';
import { RoleService } from './services/role/role.service';
import { DatabaseModule } from '@infra/database/database.module';
import { SessionService } from './services/session/session.service';
import { CryptoModule } from '@infra/crypto/crypto.module';

const providers = [UserService, RoleService, SessionService];

@Module({
  providers,
  exports: providers,
  imports: [DatabaseModule, CryptoModule],
})
export class DomainModule {}

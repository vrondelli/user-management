import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserModule } from '@application/user/user.module';
import { DomainModule } from '@domain/domain.module';

@Module({
  imports: [UserModule, DomainModule],
  controllers: [UserController],
})
export class UserPresentationModule {}

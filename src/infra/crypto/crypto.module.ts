import { Module } from '@nestjs/common';
import { BcryptCryptoService } from './bcrypt/bcrypt-crypto.service';
import { CryptoService } from '@domain/services/crypto.service';

const providers = [
  {
    provide: CryptoService,
    useClass: BcryptCryptoService,
  },
];

@Module({
  providers,
  exports: providers,
})
export class CryptoModule {}

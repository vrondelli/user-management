import { CryptoService } from '@domain/services/crypto.service';
import * as bcrypt from 'bcrypt';

export class BcryptCryptoService extends CryptoService {
  private readonly saltRounds = 10;

  async hashPassword(plain: string): Promise<string> {
    return bcrypt.hash(plain, this.saltRounds);
  }

  async comparePassword(plain: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plain, hash);
  }
}

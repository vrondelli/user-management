export abstract class CryptoService {
  abstract hashPassword(plain: string): Promise<string>;
  abstract comparePassword(plain: string, hash: string): Promise<boolean>;
}

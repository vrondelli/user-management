import { BcryptCryptoService } from './bcrypt-crypto.service';

describe('BcryptoCryptoService', () => {
  let cryptoService: BcryptCryptoService;

  beforeAll(() => {
    cryptoService = new BcryptCryptoService();
  });

  it('should hash a password correctly', async () => {
    const password = 'securePassword123';
    const hash = await cryptoService.hashPassword(password);

    expect(hash).toBeDefined();
    expect(hash).not.toEqual(password);
  });

  it('should validate a correct password against its hash', async () => {
    const password = 'securePassword123';
    const hash = await cryptoService.hashPassword(password);

    const isValid = await cryptoService.comparePassword(password, hash);
    expect(isValid).toBe(true);
  });

  it('should reject an incorrect password against its hash', async () => {
    const password = 'securePassword123';
    const hash = await cryptoService.hashPassword(password);

    const isValid = await cryptoService.comparePassword('wrongPassword', hash);
    expect(isValid).toBe(false);
  });
});

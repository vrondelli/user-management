import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Provider } from '@nestjs/common';

export const createMockCacheManagerProvider = ({
  get = jest.fn(),
  set = jest.fn(),
  del = jest.fn(),
}: Partial<Cache>): Provider<Cache> => ({
  provide: CACHE_MANAGER,
  useValue: {
    get,
    set,
    del,
  } as Cache,
});

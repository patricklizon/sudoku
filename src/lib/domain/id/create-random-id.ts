import type { Opaque } from '@/lib/utils/types/opaque';

export function createRandomStringId<T extends Opaque<string, string>>(): T {
	return crypto.randomUUID() as T;
}

import type { Opaque } from "#src/lib/utils/types/opaque";

export function createRandomStringId<T extends Opaque<string, string>>(): T {
	return crypto.randomUUID() as T;
}

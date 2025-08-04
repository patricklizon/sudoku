export function createRandomStringId<T extends Opaque<string, string>>(): T {
	return crypto.randomUUID() as T;
}

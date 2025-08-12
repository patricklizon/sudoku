export function getRandomStringId<T extends Opaque<string, string>>(): T {
	return crypto.randomUUID() as T;
}

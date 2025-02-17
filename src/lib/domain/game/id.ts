import type { Game } from './types';

export function createGameId(): Game['id'] {
	return crypto.randomUUID() as Game['id'];
}

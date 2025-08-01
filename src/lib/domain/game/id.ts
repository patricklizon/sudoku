import type { Game } from '#src/lib/domain/game/types';
import { createRandomStringId } from '#src/lib/domain/id';

export function createGameId(): Game['id'] {
	return createRandomStringId();
}

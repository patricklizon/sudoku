import type { Game } from '@/lib/domain/game/types';
import { createRandomStringId } from '@/lib/domain/id';

export function createGameId(): Game['id'] {
	return createRandomStringId();
}

import { createRandomStringId } from '@/lib/domain/id';
import type { Game } from '@/lib/domain/game/types';

export function createGameId(): Game['id'] {
	return createRandomStringId();
}

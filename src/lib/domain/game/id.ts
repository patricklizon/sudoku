import { createRandomId } from '@/lib/domain/core/id';
import type { Game } from './types';

export function createGameId(): Game['id'] {
	return createRandomId() as Game['id'];
}

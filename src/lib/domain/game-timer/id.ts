import type { GameHistoryEntry } from "#lib/domain/game-history/types";
import { createRandomStringId } from "#lib/domain/id/create-random-id";

export function createGameHistoryEnId(): GameHistoryEntry["id"] {
	return createRandomStringId();
}

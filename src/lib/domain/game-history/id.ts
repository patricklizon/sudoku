import type { GameHistoryEntry } from "#src/lib/domain/game-history/types";
import { createRandomStringId } from "#src/lib/domain/id";

export function createGameHistoryEnId(): GameHistoryEntry["id"] {
	return createRandomStringId();
}

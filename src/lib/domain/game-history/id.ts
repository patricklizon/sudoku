import type { GameHistoryEntry } from "#src/lib/domain/game-history/types";
import { getRandomStringId } from "#src/lib/utils/get-random-string-id";

export function createGameHistoryEnId(): GameHistoryEntry["id"] {
	return getRandomStringId();
}

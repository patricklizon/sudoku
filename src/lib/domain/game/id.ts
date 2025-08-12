import type { Game } from "#src/lib/domain/game/types";
import { getRandomStringId } from "#src/lib/utils/get-random-string-id";

export function createGameId(): Game["id"] {
	return getRandomStringId();
}

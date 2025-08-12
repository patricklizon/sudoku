import type { DBGameHistoryEntry } from "#src/lib/domain/game-history/types";
import type { ObjectStoreIndexRecord } from "#src/lib/utils/types/object-store";

export const gameHistoryTbl = {
	name: "game-history",
	index: {
		gameId: {
			name: "gameId",
			keyPath: "gameId",
			options: {
				unique: false,
			},
		},
		gameId_createdAt: {
			name: "gameId_createdAt",
			keyPath: ["gameId", "createdAt"],
			options: {
				unique: false,
			},
		},
	} satisfies ObjectStoreIndexRecord<keyof DBGameHistoryEntry>,
};

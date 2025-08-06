import type { DBPuzzle } from "#lib/domain/puzzle/types";
import type { ObjectStoreIndexRecord } from "#lib/utils/types/object-store";

export const puzzleTbl = {
	name: "puzzle",
	index: {
		difficultyLevel: {
			name: "difficultyLevel",
			keyPath: "difficultyLevel",
			options: {
				unique: false,
			},
		},
	} satisfies ObjectStoreIndexRecord<keyof DBPuzzle>,
};

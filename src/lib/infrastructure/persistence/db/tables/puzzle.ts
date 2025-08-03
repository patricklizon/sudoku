import type { DBPuzzle } from "#src/lib/domain/puzzle";
import type { ObjectStoreIndexRecord } from "#src/lib/utils/types/object-store";

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

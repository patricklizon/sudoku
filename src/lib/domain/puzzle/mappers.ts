import { decodePuzzle } from "#src/lib/domain/puzzle/decoder";
import type { DBPuzzle, Puzzle } from "#src/lib/domain/puzzle/types";
import type { RecordDifference } from "#src/lib/utils/types/record";

export function mapPuzzleToDB(it: Puzzle, keys: RecordDifference<DBPuzzle, Puzzle>): DBPuzzle {
	return {
		...keys,
		difficultyLevel: it.difficultyLevel,
		id: it.id,
	};
}

export function mapDBToPuzzle(it: DBPuzzle): Puzzle {
	const { problem, solution, difficultyLevel } = decodePuzzle(it.id);

	return {
		difficultyLevel,
		id: it.id,
		problem,
		solution,
	};
}

import { decodePuzzle } from "#lib/domain/puzzle/decoder";
import type { DBPuzzle, Puzzle } from "#lib/domain/puzzle/types";

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

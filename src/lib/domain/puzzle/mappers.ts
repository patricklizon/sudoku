import { decodePuzzle } from '@/lib/domain/puzzle/decoder';
import type { DBPuzzle, Puzzle } from '@/lib/domain/puzzle/types';
import type { RecordDifference } from '@/lib/utils/types/record';

export function mapPuzzleToDB(it: Puzzle, keys: RecordDifference<DBPuzzle, Puzzle>): DBPuzzle {
	return {
		...keys,
		difficulty: it.difficulty,
		id: it.id,
	};
}

export function mapDBToPuzzle(it: DBPuzzle): Puzzle {
	const { problem, solution, difficulty } = decodePuzzle(it.id);

	return {
		difficulty,
		id: it.id,
		problem,
		solution,
	};
}

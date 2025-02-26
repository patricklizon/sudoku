import type { DBPuzzle, Puzzle } from './types';
import type { RecordDifference } from '@/lib/utils/types/record';

export function mapPuzzleToDB(it: Puzzle, keys: RecordDifference<DBPuzzle, Puzzle>): DBPuzzle {
	return {
		...keys,
		id: it.id,
		difficulty: it.difficulty,
	};
}

export function mapDBToPuzzle(it: DBPuzzle): Puzzle {
	return {
		id: it.id,
		difficulty: it.difficulty,
	};
}

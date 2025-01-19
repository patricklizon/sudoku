import { createEmptyGrid } from './grid';
import type { PuzzleSolved, EncodedGrid, PuzzleSolvable } from './types';

export function decodeGrid(s: EncodedGrid): { solution: PuzzleSolved; puzzle: PuzzleSolvable } {
	const solution = createEmptyGrid();
	const puzzle = createEmptyGrid();

	return { solution, puzzle };
}

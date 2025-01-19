import { createEmptyGrid } from './grid';
import type { PuzzleSolved, EncodedGrid, Grid } from './types';

export function decodeGrid(s: EncodedGrid): { solution: Grid; board: PuzzleSolved } {
	const solution = createEmptyGrid();
	const board = createEmptyGrid();

	return { solution, board };
}

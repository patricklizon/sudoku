import { _createEmptyGrid } from './grid';
import type { PuzzleSolved, EncodedGrid, Grid } from './types';

export function decodeGrid(s: EncodedGrid): { solution: Grid; board: PuzzleSolved } {
	const solution = _createEmptyGrid();
	const board = _createEmptyGrid();

	return { solution, board };
}

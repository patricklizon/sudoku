import { _createEmptyGrid } from './grid';
import type { EncodedGrid, Grid } from './types';

export function decodeGrid(s: EncodedGrid): { solution: Grid; board: Grid } {
	const solution = _createEmptyGrid();
	const board = _createEmptyGrid();

	return { solution, board };
}

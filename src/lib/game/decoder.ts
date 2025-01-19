import { _createEmptyGrid } from './grid';
import type { Board, EncodedGrid, Grid } from './types';

export function decodeGrid(s: EncodedGrid): { solution: Grid; board: Board } {
	const solution = _createEmptyGrid();
	const board = _createEmptyGrid();

	return { solution, board };
}

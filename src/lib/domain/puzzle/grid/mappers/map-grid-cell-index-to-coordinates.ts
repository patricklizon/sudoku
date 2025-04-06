import { assertGridCellIndexIsWithinRange } from '../assertions';
import { GRID_SIZE } from '../constants';
import type { GridCellCoordinates } from '../types';

export function mapGridCellIndexToCoordinates(idx: number): GridCellCoordinates {
	assertGridCellIndexIsWithinRange(idx);

	return {
		rowIdx: Math.floor(idx / GRID_SIZE),
		colIdx: idx % GRID_SIZE,
	};
}

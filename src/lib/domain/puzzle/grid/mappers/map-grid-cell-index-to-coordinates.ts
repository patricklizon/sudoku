import { assertGridCellIndexIsWithinRange } from "#lib/domain/puzzle/grid/assertions/assert-grid-cell-index-is-within-range";
import { GRID_SIZE } from "#lib/domain/puzzle/grid/constants";
import type { GridCellCoordinates } from "#lib/domain/puzzle/grid/types";

export function mapGridCellIndexToCoordinates(idx: number): GridCellCoordinates {
	assertGridCellIndexIsWithinRange(idx);

	return {
		rowIdx: Math.floor(idx / GRID_SIZE),
		colIdx: idx % GRID_SIZE,
	};
}

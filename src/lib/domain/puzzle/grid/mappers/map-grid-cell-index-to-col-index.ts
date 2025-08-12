import { assertGridCellIndexIsWithinRange } from "#src/lib/domain/puzzle/grid/assertions/assert-grid-cell-index-is-within-range";
import { GRID_SIZE } from "#src/lib/domain/puzzle/grid/constants";

export function mapGridCellIndexToColIndex(idx: number): number {
	assertGridCellIndexIsWithinRange(idx);

	return Math.floor(idx % GRID_SIZE);
}

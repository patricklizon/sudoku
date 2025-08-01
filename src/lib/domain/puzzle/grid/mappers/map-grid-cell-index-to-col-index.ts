import { assertGridCellIndexIsWithinRange } from "../assertions";
import { GRID_SIZE } from "../constants";

export function mapGridCellIndexToColIndex(idx: number): number {
	assertGridCellIndexIsWithinRange(idx);

	return Math.floor(idx % GRID_SIZE);
}

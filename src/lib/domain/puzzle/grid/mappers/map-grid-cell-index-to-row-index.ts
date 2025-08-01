import { assertGridCellIndexIsWithinRange } from "../assertions";
import { GRID_SIZE } from "../constants";

export function mapGridCellIndexToRowIndex(idx: number): number {
	assertGridCellIndexIsWithinRange(idx);

	return Math.floor(idx / GRID_SIZE);
}

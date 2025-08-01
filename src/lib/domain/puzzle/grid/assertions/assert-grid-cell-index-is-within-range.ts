import type { Range } from "#src/lib/utils/types/range";
import { GRID_CELL_COUNT } from "../constants";
import { ValueOutOfRangeError } from "../errors";


/**
 * @throws {ValueOutOfRangeError} when number is out of allowed range.
 */
export function assertGridCellIndexIsWithinRange(idx: number): void {
	const range = [0, GRID_CELL_COUNT - 1] satisfies Range<number>;
	if (idx < range[0] || range[1] < idx) {
		throw new ValueOutOfRangeError(range, idx);
	}
}

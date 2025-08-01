import { GRID_SIZE } from "../constants";
import { ValueOutOfRangeError } from "../errors";

/**
 * @throws {ValueOutOfRangeError} when number is out of allowed range.
 */
export function assertGridCellCoordinateIsWithinRange(it: number): void {
	const range: [start: number, end: number] = [0, GRID_SIZE - 1];
	if (range[0] <= it && it <= range[1]) return;
	throw new ValueOutOfRangeError(range, it);
}

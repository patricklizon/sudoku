import { describe, test, expect } from "vitest";
import { GRID_SIZE } from "#src/lib/domain/puzzle/grid/constants";
import { ValueOutOfRangeError } from "#src/lib/domain/puzzle/grid/errors";
import { assertGridCellCoordinateIsWithinRange } from "./assert-grid-cell-coordinates-is-within-range";

describe("#" + assertGridCellCoordinateIsWithinRange.name, () => {
	test.each<number>([-Number.MAX_SAFE_INTEGER, -2, -1, 9, 11, Number.MAX_SAFE_INTEGER])(
		"throws when out of range",
		(value) => {
			expect(() => {
				assertGridCellCoordinateIsWithinRange(value);
			}).toThrow(ValueOutOfRangeError);
		},
	);

	test.each<number>(Array.from({ length: GRID_SIZE }, (_, idx) => idx))(
		"does nothing when within range",
		(value) => {
			expect(() => {
				assertGridCellCoordinateIsWithinRange(value);
			}).not.toThrow(ValueOutOfRangeError);
		},
	);
});

import { test, expect } from "vitest";
import { ValueOutOfRangeError } from "#src/lib/domain/puzzle/grid/errors";
import { mapGridCellIndexToRowIndex } from "./map-grid-cell-index-to-row-index";

test.each<[gridIdx: number, rowIdx: number][]>([
	[
		[0, 0],
		[2, 0],
		[33, 4],
	],
])("returns coorect row index", ([index, coordinates]) => {
	expect(mapGridCellIndexToRowIndex(index)).toStrictEqual(coordinates);
});

test.each<number[]>([[-1, Number.POSITIVE_INFINITY]])(
	"throws error when index is out or range",
	(index) => {
		expect(() => {
			mapGridCellIndexToRowIndex(index);
		}).toThrowError(ValueOutOfRangeError);
	},
);

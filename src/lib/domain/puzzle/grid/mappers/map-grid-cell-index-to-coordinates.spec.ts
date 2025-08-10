import { test, expect } from "vitest";
import { ValueOutOfRangeError } from "#lib/domain/puzzle/grid/errors";
import type { GridCellCoordinates } from "#lib/domain/puzzle/grid/types";
import { mapGridCellIndexToCoordinates } from "./map-grid-cell-index-to-coordinates";

test.each<[index: number, coordinates: GridCellCoordinates][]>([
	[
		[0, { rowIdx: 0, colIdx: 0 }],
		[2, { rowIdx: 0, colIdx: 2 }],
		[33, { rowIdx: 4, colIdx: 7 }],
	],
])("returns coorect coordinates", ([index, coordinates]) => {
	expect(mapGridCellIndexToCoordinates(index)).toStrictEqual(coordinates);
});

test.each<number[]>([[-1, Number.POSITIVE_INFINITY]])(
	"throws error when index is out or range",
	(index) => {
		expect(() => {
			mapGridCellIndexToCoordinates(index);
		}).toThrowError(ValueOutOfRangeError);
	},
);

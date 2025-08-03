import { describe, test, expect } from "vitest";
import { ValueOutOfRangeError } from "../errors";
import { mapGridCellIndexToColIndex } from "./map-grid-cell-index-to-col-index";

describe("#" + mapGridCellIndexToColIndex.name, () => {
	test.each<[gridIdx: number, rowIdx: number][]>([
		[
			[0, 0],
			[2, 2],
			[33, 7],
		],
	])("returns correct row index", ([index, coordinates]) => {
		expect(mapGridCellIndexToColIndex(index)).toStrictEqual(coordinates);
	});

	test.each<number[]>([[-1, Number.POSITIVE_INFINITY]])(
		"throws error when index is out or range",
		(index) => {
			expect(() => {
				mapGridCellIndexToColIndex(index);
			}).toThrowError(ValueOutOfRangeError);
		},
	);
});

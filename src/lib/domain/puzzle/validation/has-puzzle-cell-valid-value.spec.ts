import { expect, describe, test } from "vitest";
import type { GridFilled, GridCellCoordinates } from "#src/lib/domain/puzzle/grid";
import { hasPuzzleCellValidValue } from "./has-puzzle-cell-valid-value";

describe("#" + hasPuzzleCellValidValue.name, () => {
	const puzzleSolved = [
		[7, 6, 5, 1, 2, 8, 3, 4, 9],
		[3, 9, 1, 4, 5, 6, 2, 8, 7],
		[2, 4, 8, 3, 9, 7, 1, 5, 6],
		[1, 2, 6, 8, 7, 3, 5, 9, 4],
		[5, 7, 9, 2, 6, 4, 8, 3, 1],
		[4, 8, 3, 5, 1, 9, 7, 6, 2],
		[6, 1, 4, 7, 3, 5, 9, 2, 8],
		[9, 5, 2, 6, 8, 1, 4, 7, 3],
		[8, 3, 7, 9, 4, 2, 6, 1, 5],
	].flat() as GridFilled;

	test.each<
		[
			coordinates: GridCellCoordinates,
			val: number,
			expectedResult: ReturnType<typeof hasPuzzleCellValidValue>,
		]
	>([
		[{ rowIdx: 0, colIdx: 0 }, 8, false],
		[{ rowIdx: 1, colIdx: 1 }, 6, false],
		[{ rowIdx: 8, colIdx: 3 }, 6, false],
		[{ rowIdx: 0, colIdx: 0 }, 7, true],
		[{ rowIdx: 1, colIdx: 1 }, 9, true],
		[{ rowIdx: 8, colIdx: 3 }, 9, true],
	])("%j returns correct value when passing %d", (coordinates, val, expected) => {
		expect(hasPuzzleCellValidValue(puzzleSolved, coordinates, val)).toEqual(expected);
	});
});

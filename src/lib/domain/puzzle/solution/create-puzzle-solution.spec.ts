import { describe, expect, test } from "vitest";
import { GRID_CELL_COUNT, GRID_SIZE } from "#lib/domain/puzzle/grid/constants";
import { isGridCellValueCorrectAt } from "#lib/domain/puzzle/grid/grid";
import { createPuzzleSolution } from "#lib/domain/puzzle/solution/create-puzzle-solution";

describe("#" + createPuzzleSolution.name, () => {
	test("generates correct puzzle", () => {
		const solution = createPuzzleSolution();

		expect(solution).toHaveLength(GRID_CELL_COUNT);
		expect(solution.every(Number.isInteger)).toEqual(true);

		for (let rowIdx = 0; rowIdx < GRID_SIZE; rowIdx++) {
			for (let colIdx = 0; colIdx < GRID_SIZE; colIdx++) {
				expect(isGridCellValueCorrectAt(solution, { rowIdx, colIdx }));
			}
		}
	});
});

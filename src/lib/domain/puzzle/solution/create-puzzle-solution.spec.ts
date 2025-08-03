import { describe, expect, test } from "bun:test";
import { GRID_CELL_COUNT, GRID_SIZE, isGridCellValueCorrectAt } from "#src/lib/domain/puzzle/grid";
import { createPuzzleSolution } from "./create-puzzle-solution";

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

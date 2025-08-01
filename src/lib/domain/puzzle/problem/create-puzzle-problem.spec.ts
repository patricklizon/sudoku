import { describe, expect, test } from "vitest";

import { createPuzzleProblem } from "./create-puzzle-problem";

import {
	DIFFICULTY_LEVEL,
	MINIMUM_GIVEN_CELLS_COUNT_IN_LINE_BY_DIFFICULTY_LEVEL,
	TOTAL_GIVEN_CELLS_RANGE_BY_DIFFICULTY_LEVEL,
} from "#src/lib/domain/puzzle/difficulty";
import {
	GRID_SIZE,
	isGridCellFilled,
	readGridColumnAt,
	readGridRowCellsAt,
} from "#src/lib/domain/puzzle/grid";
import type { PuzzleDifficultyLevel, PuzzleSolution } from "#src/lib/domain/puzzle/types";

// TODO: Object.values(DIFFICULTY_LEVEL)
describe.each<PuzzleDifficultyLevel>([
	DIFFICULTY_LEVEL[1],
	DIFFICULTY_LEVEL[2],
	DIFFICULTY_LEVEL[3],
	DIFFICULTY_LEVEL[4],
])(createPuzzleProblem.name, (level) => {
	const p = structuredClone(
		[
			[7, 6, 5, 1, 2, 8, 3, 4, 9],
			[3, 9, 1, 4, 5, 6, 2, 8, 7],
			[2, 4, 8, 3, 9, 7, 1, 5, 6],
			[1, 2, 6, 8, 7, 3, 5, 9, 4],
			[5, 7, 9, 2, 6, 4, 8, 3, 1],
			[4, 8, 3, 5, 1, 9, 7, 6, 2],
			[6, 1, 4, 7, 3, 5, 9, 2, 8],
			[9, 5, 2, 6, 8, 1, 4, 7, 3],
			[8, 3, 7, 9, 4, 2, 6, 1, 5],
		].flat(),
	) as PuzzleSolution;
	const puzzle = createPuzzleProblem(p, level);

	test(`creates correct amount of holes for difficulty level '${level.toString()}'`, () => {
		const left = puzzle.filter(isGridCellFilled);

		expect(left)
			.to.have.length.of.at.least(TOTAL_GIVEN_CELLS_RANGE_BY_DIFFICULTY_LEVEL[level]![0])
			.and.at.most(TOTAL_GIVEN_CELLS_RANGE_BY_DIFFICULTY_LEVEL[level]![1]);
	});

	test.each(Array.from({ length: GRID_SIZE }, (_, idx) => idx))(
		`removes correct amount of elements from rows and cols for given difficulty level (${level.toString()})`,
		(idx) => {
			const cellsFilledCount = MINIMUM_GIVEN_CELLS_COUNT_IN_LINE_BY_DIFFICULTY_LEVEL[level]!;

			expect(
				readGridRowCellsAt(puzzle, { colIdx: 0, rowIdx: idx }).filter(isGridCellFilled),
			).to.have.length.of.at.least(cellsFilledCount);
			expect(
				readGridColumnAt(puzzle, { colIdx: idx, rowIdx: 0 }).filter(isGridCellFilled),
			).to.have.length.of.at.least(cellsFilledCount);
		},
	);
});

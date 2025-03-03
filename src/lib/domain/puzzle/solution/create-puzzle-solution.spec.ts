import { describe, expect, test } from 'vitest';

import { createPuzzleSolution } from './create-puzzle-solution';

import { GRID_CELL_COUNT, GRID_SIZE, isGridCellValueCorrectAt } from '$lib/domain/puzzle/grid';

describe(createPuzzleSolution.name, () => {
	test('generates correct puzzle', () => {
		const solution = createPuzzleSolution();

		expect(solution).to.have.length(GRID_CELL_COUNT);
		expect(solution.every(Number.isInteger)).to.equal(true);

		for (let rowIdx = 0; rowIdx < GRID_SIZE; rowIdx++) {
			for (let colIdx = 0; colIdx < GRID_SIZE; colIdx++) {
				expect(isGridCellValueCorrectAt(solution, { rowIdx, colIdx }));
			}
		}
	});
});

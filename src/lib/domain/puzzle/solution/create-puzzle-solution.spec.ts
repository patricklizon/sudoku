import { describe, expect, test } from 'vitest';
import {
	GRID_CELLS_COUNT,
	GRID_SIZE,
	isGridCellValueCorrectAtCoordinates,
} from '@/lib/domain/puzzle/grid';
import { createPuzzleSolution } from './create-puzzle-solution';

describe(createPuzzleSolution.name, () => {
	test('generates correct puzzle', () => {
		const solution = createPuzzleSolution();

		expect(solution).to.have.length(GRID_CELLS_COUNT);
		expect(solution.every(Number.isInteger)).to.equal(true);

		for (let rowIdx = 0; rowIdx < GRID_SIZE; rowIdx++) {
			for (let colIdx = 0; colIdx < GRID_SIZE; colIdx++) {
				expect(isGridCellValueCorrectAtCoordinates(solution, { rowIdx, colIdx }));
			}
		}
	});
});

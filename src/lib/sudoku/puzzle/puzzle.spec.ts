import { describe, expect, test } from 'vitest';
import { GRID_CELLS_COUNT, GRID_SIZE, isValueCorrectForCellAtPosition } from '@/lib/sudoku/grid';
import { createSolvedPuzzle } from './puzzle';

describe(createSolvedPuzzle.name, () => {
	test('generates correct puzzle', () => {
		const solvedPuzzle = createSolvedPuzzle();

		expect(solvedPuzzle).to.have.length(GRID_CELLS_COUNT);
		expect(solvedPuzzle.every(Number.isInteger)).to.equal(true);

		for (let rowIdx = 0; rowIdx < GRID_SIZE; rowIdx++) {
			for (let colIdx = 0; colIdx < GRID_SIZE; colIdx++) {
				expect(isValueCorrectForCellAtPosition(solvedPuzzle, rowIdx, colIdx));
			}
		}
	});
});

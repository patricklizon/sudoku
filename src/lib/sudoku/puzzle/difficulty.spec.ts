import { test, expect } from 'vitest';
import { GRID_CELLS_COUNT } from '@/lib/sudoku/grid';
import { MINIMUM_REQUIRED_CELLS_BY_DIFFICULTY } from './difficulty';

test.each<boolean>([
	MINIMUM_REQUIRED_CELLS_BY_DIFFICULTY.easy > MINIMUM_REQUIRED_CELLS_BY_DIFFICULTY.normal,
	MINIMUM_REQUIRED_CELLS_BY_DIFFICULTY.normal > MINIMUM_REQUIRED_CELLS_BY_DIFFICULTY.hard,
	MINIMUM_REQUIRED_CELLS_BY_DIFFICULTY.hard > MINIMUM_REQUIRED_CELLS_BY_DIFFICULTY.expert,
])('difficulty scales correctly', (b) => {
	expect(b).to.equal(true);
});

test('cells count is within correct range', () => {
	expect(MINIMUM_REQUIRED_CELLS_BY_DIFFICULTY.expert >= 17).to.equal(true);
	expect(MINIMUM_REQUIRED_CELLS_BY_DIFFICULTY.easy < GRID_CELLS_COUNT).to.equal(true);
});

import { test, expect } from 'vitest';
import { MINIMUM_REQUIRED_CELLS_BY_DIFFICULTY } from './difficulty';

test.each<boolean>([
	MINIMUM_REQUIRED_CELLS_BY_DIFFICULTY.easy > MINIMUM_REQUIRED_CELLS_BY_DIFFICULTY.normal,
	MINIMUM_REQUIRED_CELLS_BY_DIFFICULTY.normal > MINIMUM_REQUIRED_CELLS_BY_DIFFICULTY.hard,
	MINIMUM_REQUIRED_CELLS_BY_DIFFICULTY.hard > MINIMUM_REQUIRED_CELLS_BY_DIFFICULTY.expert,
])('difficulty scales correctly', (b) => {
	expect(b).to.equal(true);
});

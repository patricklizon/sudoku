import { describe, test, expect } from 'vitest';

import { GRID_CELL_COUNT } from '../constants';
import { ValueOutOfRangeError } from '../errors';

import { assertGridCellIndexIsWithinRange } from './assert-grid-cell-index-is-within-range';

describe(assertGridCellIndexIsWithinRange.name, () => {
	test.each<number>([-Number.MAX_SAFE_INTEGER, -2, -1, GRID_CELL_COUNT, Number.MAX_SAFE_INTEGER])(
		'throws when out of range',
		(value) => {
			expect(() => {
				assertGridCellIndexIsWithinRange(value);
			}).to.throw(ValueOutOfRangeError);
		},
	);

	test.each<number>(Array.from({ length: GRID_CELL_COUNT }, (_, idx) => idx))(
		'does nothing when within range',
		(value) => {
			expect(() => {
				assertGridCellIndexIsWithinRange(value);
			}).not.to.throw(ValueOutOfRangeError);
		},
	);
});

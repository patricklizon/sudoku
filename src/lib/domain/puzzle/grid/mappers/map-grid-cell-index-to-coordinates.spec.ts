import { describe, test, expect } from 'vitest';

import { ValueOutOfRangeError } from '../errors';
import type { GridCellCoordinates } from '../types';

import { mapGridCellIndexToCoordinates } from './map-grid-cell-index-to-coordinates';

describe(mapGridCellIndexToCoordinates.name, () => {
	test.each<[index: number, coordinates: GridCellCoordinates][]>([
		[
			[0, { rowIdx: 0, colIdx: 0 }],
			[2, { rowIdx: 0, colIdx: 2 }],
			[33, { rowIdx: 4, colIdx: 7 }],
		],
	])('returns coorect coordinates', ([index, coordinates]) => {
		expect(mapGridCellIndexToCoordinates(index)).to.deep.equal(coordinates);
	});

	test.each<number[]>([[-1, Number.POSITIVE_INFINITY]])(
		'throws error when index is out or range',
		(index) => {
			expect(() => {
				mapGridCellIndexToCoordinates(index);
			}).toThrowError(ValueOutOfRangeError);
		},
	);
});

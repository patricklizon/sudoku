import { gridDebug } from './debug';
import type { Grid, GridWithPossibleValues } from './types';

import type { Range } from '$lib/utils/types/range';

export class ValueOutOfRangeError extends Error {
	constructor(range: Range<number>, value: number) {
		super(
			`Values (${value.toString()}) is out of range [${range[0].toString()}-${range[1].toString()}]`,
		);
	}
}

export class GridHasWrongSizeError extends Error {
	constructor(grid: Grid) {
		super(`Incorrect grid: ${gridDebug(grid)}`);
	}
}

export class UnableToPopulateGridWithValuesError extends Error {
	constructor(grid: Grid | GridWithPossibleValues) {
		super(`Unable to populate grid with values: ${gridDebug(grid)}`);
	}
}

export class UnableToRemoveGridCellsError extends Error {
	constructor(grid: Grid | GridWithPossibleValues) {
		super(`Unable to remove grid cells from grid: ${gridDebug(grid)}`);
	}
}

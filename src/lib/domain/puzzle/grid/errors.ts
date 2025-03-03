import type { Range } from '@/lib/utils/types/range';

import { debug } from './debug';
import type { Grid, GridWithPossibleValues } from './types';

export class ValueOutOfRangeError extends Error {
	constructor(range: Range<number>, value: number) {
		super(
			`Values (${value.toString()}) is out of range [${range[0].toString()}-${range[1].toString()}]`,
		);
	}
}

export class GridHasWrongSizeError extends Error {
	constructor(grid: Grid) {
		super(`Incorrect grid: ${debug(grid)}`);
	}
}

export class UnableToPopulateGridWithValuesError extends Error {
	constructor(grid: Grid | GridWithPossibleValues) {
		super(`Unable to populate grid with values: ${debug(grid)}`);
	}
}

export class UnableToRemoveGridCellsError extends Error {
	constructor(grid: Grid | GridWithPossibleValues) {
		super(`Unable to remove grid cells from grid: ${debug(grid)}`);
	}
}

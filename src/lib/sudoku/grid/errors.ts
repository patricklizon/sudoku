import { prettyDebug } from '@/lib/sudoku/grid/utils';
import type { Grid } from './types';
import type { Range } from '@/lib/types/range';

export class ValueOutOfRangeError extends Error {
	constructor(range: Range<number>, value: number) {
		super(
			`Values (${value.toString()}) is out of range [${range[0].toString()}-${range[1].toString()}]`,
		);
	}
}

export class IncorrectGridError extends Error {
	constructor(grid: Grid) {
		super(`Incorrect grid: ${prettyDebug(grid)}`);
	}
}

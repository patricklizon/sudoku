import type { Range } from '@/lib/utils/types/range';

import { prettyDebug } from './utils';
import type { Grid } from './types';

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

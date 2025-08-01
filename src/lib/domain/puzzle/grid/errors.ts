import type { Range } from "#src/lib/utils/types/range";
import { gridDebugFormatter } from "./debug-formatter";
import type { Grid, GridWithPossibleValues } from "./types";

export class ValueOutOfRangeError extends Error {
	constructor(range: Range<number>, value: number) {
		super(
			`Values (${value.toString()}) is out of range [${range[0].toString()}-${range[1].toString()}]`,
		);
	}
}

export class GridHasWrongSizeError extends Error {
	constructor(grid: Grid) {
		super(`Incorrect grid: ${gridDebugFormatter(grid)}`);
	}
}

export class UnableToFillGridWithValuesError extends Error {
	constructor(grid: Grid | GridWithPossibleValues) {
		super(`Unable to populate grid with values: ${gridDebugFormatter(grid)}`);
	}
}

export class UnableToRemoveGridCellsError extends Error {
	constructor(grid: Grid | GridWithPossibleValues) {
		super(
			`Unable to remove grid cells, according to constrains, from grid: ${gridDebugFormatter(grid)}`,
		);
	}
}

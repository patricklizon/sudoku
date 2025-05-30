import type { GridCellFilled } from './types';

export const GRID_SIZE = 9;
export const GRID_SIZE_INDEXES: readonly number[] = Array.from(
	{ length: GRID_SIZE },
	(_, idx) => idx,
);

export const GRID_BOX_SIZE = 3;
export const GRID_BOX_CELLS_COUNT = 9;
export const GRID_BOX_CELLS_INDEXES: readonly number[] = Array.from(
	{ length: GRID_BOX_CELLS_COUNT },
	(_, idx) => idx,
);

export const GRID_CELL_COUNT = 81;

/** {@link GRID_CELL_COUNT} amount of indexes, from 0 to max */
export const GRID_CELL_INDEXES: readonly number[] = Array.from(
	{ length: GRID_CELL_COUNT },
	(_, idx) => idx,
);
export const GRID_CELL_ALLOWED_VALUES: ReadonlySet<GridCellFilled> = new Set(
	Array.from({ length: GRID_SIZE }, (_, i) => ++i),
);

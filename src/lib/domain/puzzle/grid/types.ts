import type { FixedSizeCollection } from '@/lib/utils/types/collection';
import type { Nil } from '@/lib/utils/types/option';
import type { GRID_CELL_COUNT, GRID_SIZE, GRID_BOX_CELLS_COUNT } from './constants';

export type GridCellFilled = number;
export type GridCellEmpty = Nil;
export type GridCellEmptyWithPossibleValues = Set<GridCellFilled>;
export type GridCell = GridCellFilled | GridCellEmpty;
export type GridCellCoordinates = {
	rowIdx: number;
	colIdx: number;
};

export type Grid<T extends GridCell | GridCellEmptyWithPossibleValues = GridCell> =
	FixedSizeCollection<T, typeof GRID_CELL_COUNT>;
export type GridFilled = Grid<number>;

export type GridWithPossibleValues = Grid<GridCellEmptyWithPossibleValues | GridCellFilled>;
export type GridBoxWithPossibleValues = GridBox<GridCellEmptyWithPossibleValues | GridCellFilled>;

/**
 * One of 9 rows containing {@link GridCell}s
 * @example
 * ```txt
 * One row:
 * |_, _, _|
 * |D, D, D|
 * |_, _, _|
 * ```
 */
export type GridRow<T extends GridCell | GridCellEmptyWithPossibleValues = GridCell> =
	FixedSizeCollection<T, typeof GRID_SIZE>;

/**
 * One of 9 columns containing {@link GridCell}s
 * @example
 * ```txt
 * Column:
 * |_, D, _|
 * |_, D, _|
 * |_, D, _|
 * ```
 */
export type GridColumn<T extends GridCell | GridCellEmptyWithPossibleValues = GridCell> =
	FixedSizeCollection<T, typeof GRID_SIZE>;

/**
 * One of 9 sub grids containing {@link GridCell}s
 * @example
 * ```txt
 * One sub grid:
 * |_, _, _|
 * |_, D, _|
 * |_, _, _|
 * ```
 */
export type GridBox<T extends GridCell | GridCellEmptyWithPossibleValues = GridCell> =
	FixedSizeCollection<T, typeof GRID_BOX_CELLS_COUNT>;

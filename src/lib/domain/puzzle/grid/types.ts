import type { FixedSizeCollection } from '@/lib/utils/types/collection';
import type { Nil, Option } from '@/lib/utils/types/option';
import type { GRID_CELLS_COUNT, GRID_SIZE, SUB_GRID_CELLS_COUNT } from './constants';

export type GridCellFilledValue = number;
export type GridCellEmptyValue = Nil;
export type GridCellValue = GridCellFilledValue | GridCellEmptyValue;
export type GridCellCoordinates = {
	rowIdx: number;
	colIdx: number;
};

export type Grid<T extends GridCellValue = GridCellValue> = FixedSizeCollection<
	T,
	typeof GRID_CELLS_COUNT
>;
export type GridFilled = Grid<number>;

/**
 * One of 9 rows containing {@link GridCellValue}s
 * @example
 * ```txt
 * One row:
 * |_, _, _|
 * |D, D, D|
 * |_, _, _|
 * ```
 */
export type GridRow<T extends GridCellValue = GridCellValue> = FixedSizeCollection<
	T,
	typeof GRID_SIZE
>;

/**
 * One of 9 columns containing {@link GridCellValue}s
 * @example
 * ```txt
 * Column:
 * |_, D, _|
 * |_, D, _|
 * |_, D, _|
 * ```
 */
export type GridCol<T extends GridCellValue = GridCellValue> = FixedSizeCollection<
	T,
	typeof GRID_SIZE
>;

/**
 * One of 9 sub grids containing {@link GridCellValue}s
 * @example
 * ```txt
 * One sub grid:
 * |_, _, _|
 * |_, D, _|
 * |_, _, _|
 * ```
 */
export type SubGrid<T extends GridCellValue = GridCellValue> = FixedSizeCollection<
	T,
	typeof SUB_GRID_CELLS_COUNT
>;

export type ConstructionGrid = Option<number | Set<number>>[];
export type ConstructionSubGrid = Option<number | Set<number>>[];

import type { FixedSizeCollection } from '@/lib/utils/types/collection';
import type { Nil } from '@/lib/utils/types/option';
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
export type GridRow<T extends GridCellValue = GridCellValue> = FixedSizeCollection<
	T,
	typeof GRID_SIZE
>;
export type GridCol<T extends GridCellValue = GridCellValue> = FixedSizeCollection<
	T,
	typeof GRID_SIZE
>;

export type SubGrid<T extends GridCellValue = GridCellValue> = FixedSizeCollection<
	T,
	typeof SUB_GRID_CELLS_COUNT
>;

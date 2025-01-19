import type { Option } from '@/lib/types/option';
import type { Opaque } from '@/lib/types/opaque';
import type { FixedSizeCollection } from '@/lib/types/collection';
import { GRID_FIELDS_COUNT, GRID_SIZE, SUB_GRID_FIELDS_COUNT } from './constants';

export type GridCell = Option<number>;

export type Grid<T extends GridCell = GridCell> = FixedSizeCollection<
	T,
	typeof GRID_FIELDS_COUNT
>[];
export type GridFilled = Grid<number>;
export type GridRow<T extends GridCell = GridCell> = FixedSizeCollection<T, typeof GRID_SIZE>;
export type GridCol<T extends GridCell = GridCell> = FixedSizeCollection<T, typeof GRID_SIZE>;
export type SubGrid<T extends GridCell = GridCell> = FixedSizeCollection<
	T,
	typeof SUB_GRID_FIELDS_COUNT
>;

export type EncodedGrid = Opaque<'encoded-grid', string>;

export type PuzzleSolved = GridFilled;
export type PuzzleSolvable = Grid;

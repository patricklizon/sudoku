import type { Nil } from '@/lib/types/option';
import type { Opaque } from '@/lib/types/opaque';
import { GRID_FIELDS_COUNT, GRID_SIZE, SUB_GRID_FIELDS_COUNT } from './constants';

type GridFieldFilled = number;
type GridFieldEmpty = Nil;
export type GridField = GridFieldEmpty | GridFieldFilled;

export type Grid<T extends GridField = GridField> = T[] & { length: typeof GRID_FIELDS_COUNT };
export type GridFilled = Grid<GridFieldFilled>;
export type GridRow = GridField[] & { length: typeof GRID_SIZE };
export type GridCol = GridField[] & { length: typeof GRID_SIZE };

export type SubGrid = GridField[] & { length: typeof SUB_GRID_FIELDS_COUNT };

export type EncodedGrid = Opaque<'encoded-grid', string>;

export type PuzzleSolved = GridFilled;
export type PuzzleSolvable = Grid;

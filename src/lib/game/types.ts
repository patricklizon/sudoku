import type { Option } from '@/lib/types/option';
import type { Opaque } from '@/lib/types/opaque';
import { GRID_FIELDS_COUNT, GRID_SIZE, SUB_GRID_FIELDS_COUNT } from './constants';

export type GridField = Option<number>;
export type SubGrid = GridField[] & { length: typeof SUB_GRID_FIELDS_COUNT };
export type Board = NonNullable<GridField>[] & { length: typeof GRID_FIELDS_COUNT };
export type Grid = GridField[] & { length: typeof GRID_FIELDS_COUNT };
export type GridRow = GridField[] & { length: typeof GRID_SIZE };
export type GridCol = GridField[] & { length: typeof GRID_SIZE };
export type EncodedGrid = Opaque<'encoded-grid', string>;

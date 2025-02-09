export const SUB_GRID_SIZE = 3;
export const SUB_GRID_CELLS_COUNT = 9;

export const GRID_SIZE = 9;
export const GRID_CELLS_COUNT = 81;
export const GRID_CELLS_INDEXES = Array.from({ length: GRID_CELLS_COUNT }, (_, idx) => idx);

export const CELL_ALLOWED_VALUES = new Set(Array.from({ length: GRID_SIZE }, (_, i) => ++i));

import { GRID_CELL_ALLOWED_VALUES } from "#lib/domain/puzzle/grid/constants";
import { isNil } from "#lib/utils/is-nil";
import type { GridCell, GridCellEmptyWithPossibleValues, GridCellFilled } from "../types";

export function isGridCellFilled(
	it: GridCell | GridCellEmptyWithPossibleValues,
): it is GridCellFilled {
	if (isNil(it) || it instanceof Set) return false;
	return GRID_CELL_ALLOWED_VALUES.has(it);
}

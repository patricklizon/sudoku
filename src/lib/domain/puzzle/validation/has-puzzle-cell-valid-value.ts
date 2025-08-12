import { readGridCellAt } from "#src/lib/domain/puzzle/grid/grid";
import type { GridFilled, GridCellCoordinates, GridCell } from "#src/lib/domain/puzzle/grid/types";

export function hasPuzzleCellValidValue(
	g: GridFilled,
	coordinates: GridCellCoordinates,
	value: GridCell,
): boolean {
	return readGridCellAt(g, coordinates) === value;
}

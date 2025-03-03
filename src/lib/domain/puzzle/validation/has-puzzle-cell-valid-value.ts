import {
	type GridFilled,
	type GridCellCoordinates,
	readGridCellAt,
	type GridCell,
} from '$lib/domain/puzzle/grid';

export function hasPuzzleCellValidValue(
	g: GridFilled,
	coordinates: GridCellCoordinates,
	value: GridCell,
): boolean {
	return readGridCellAt(g, coordinates) === value;
}

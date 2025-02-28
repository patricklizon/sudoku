import {
	type GridFilled,
	type GridCellCoordinates,
	readGridCell,
	type GridCellValue,
} from '@/lib/domain/puzzle/grid';

export function hasPuzzleCellValidValue(
	g: GridFilled,
	coordinates: GridCellCoordinates,
	value: GridCellValue,
): boolean {
	return readGridCell(g, coordinates) === value;
}

import {
	GRID_CELLS_COUNT,
	IncorrectGridError,
	SUB_GRID_SIZE,
	createEmptyGrid,
	fillDiagonalSubGrids,
	isGridCellFilled,
	readCoordinateByGridCellIndex,
	readGridCell,
	readAllowedGridCellCellValuesAtCoordinates,
	readGridCol,
	readGridRow,
	type GridCellCoordinates,
	type GridCell,
} from '@/lib/sudoku/grid';
import { getRandomInt } from '@/lib/utils/get-random-number';
import { toSuffledArray } from '@/lib/utils/to-shuffled-array';
import type { Option } from '@/lib/types/option';
import type { PuzzleDifficultyLevel, PuzzleSolved, PuzzleUnsolved } from './types';
import {
	LOWER_BOUND_OF_GIVEN_CELLS_IN_ROW_AND_COLUMN_BY_DIFFICULTY_LEVEL,
	TOTAL_GIVEN_CELLS_RANGE_BY_DIFFICULTY_LEVEL,
} from './difficulty';

/**
 * Creates a fully solved Sudoku puzzle.
 *
 * @throws {IncorrectGridError} when a valid solution cannot be generated
 */
export function createSolvedPuzzle(): Readonly<PuzzleSolved> {
	const grid = createEmptyGrid();

	// Creating start with filling the diagonal sub-grids because these can be filled
	// independently without violating sudoku rules.
	// This initial filling provides anchor points that make the subsequent filling of
	// remaining cells more efficient, as it reduces the number of possible valid combinations
	// for the rest of the grid.
	fillDiagonalSubGrids(grid);

	if (fillPuzzle(grid, SUB_GRID_SIZE)) return grid;

	throw new IncorrectGridError(grid);
}

/**
 * Mutatest passed puzzle.
 */
export function fillPuzzle(p: PuzzleUnsolved, idx: number): p is PuzzleSolved {
	if (p.every(isGridCellFilled)) return true;

	const cellCopy = p[idx];
	const nextIdx = idx + 1;
	if (isGridCellFilled(cellCopy)) return fillPuzzle(p, nextIdx);

	const coordinates = readCoordinateByGridCellIndex(idx);
	for (const v of readAllowedGridCellCellValuesAtCoordinates(p, coordinates)) {
		p[idx] = v;
		if (fillPuzzle(p, nextIdx)) return true;
	}

	p[idx] = cellCopy;
	return false;
}

/**
 * Creates unsolved sudoku puzzle with unique solution.
 */
export function createUnsolvedPuzzle(
	p: Readonly<PuzzleSolved>,
	pdl: PuzzleDifficultyLevel,
): PuzzleUnsolved {
	const puzzle = structuredClone<PuzzleUnsolved>(p);
	const [low, high] = TOTAL_GIVEN_CELLS_RANGE_BY_DIFFICULTY_LEVEL[pdl];
	const minimumHintsCount = low + getRandomInt(high - low);
	const minimumHintsInRowAndColumnCount =
		LOWER_BOUND_OF_GIVEN_CELLS_IN_ROW_AND_COLUMN_BY_DIFFICULTY_LEVEL[pdl];

	const traverseIdxs = toSuffledArray(Array.from({ length: GRID_CELLS_COUNT }, (_, idx) => idx));

	let cellCopy: GridCell;
	let stepsCount = traverseIdxs.length;
	let coordinates: Option<GridCellCoordinates>;
	for (const idx of traverseIdxs) {
		coordinates = readCoordinateByGridCellIndex(idx);
		cellCopy = puzzle[idx];
		puzzle[idx] = undefined;

		if (
			readGridRow(puzzle, coordinates).filter(isGridCellFilled).length >=
				minimumHintsInRowAndColumnCount &&
			readGridCol(puzzle, coordinates).filter(isGridCellFilled).length >=
				minimumHintsInRowAndColumnCount
			// TODO: implement check for unique solution
			// hasUniqueSolution(puzzle)
		) {
			stepsCount--;
			puzzle[idx] = undefined;

			if (stepsCount <= minimumHintsCount) {
				return puzzle;
			}

			continue;
		} else {
			puzzle[idx] = cellCopy;
		}
	}

	return puzzle;
}

export function isValueValid(
	p: PuzzleSolved,
	rowIdx: number,
	colIdx: number,
	value: number,
): boolean {
	return readGridCell(p, rowIdx, colIdx) === value;
}

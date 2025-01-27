import {
	GRID_CELLS_COUNT,
	GRID_SIZE,
	IncorrectGridError,
	SUB_GRID_SIZE,
	createEmptyGrid,
	fillDiagonalSubGrids,
	isValueCorrectForCellAtPosition,
	readGridCell,
	type GridCellCoordinates,
} from '@/lib/sudoku/grid';
import type { PuzzleDifficultyLevel, PuzzleSolved, PuzzleUnsolved } from './types';
import {
	LOWER_BOUND_OF_GIVEN_CELLS_IN_ROW_AND_COLUMN_BY_DIFFICULTY_LEVEL,
	TOTAL_GIVEN_CELLS_RANGE_BY_DIFFICULTY_LEVEL,
} from './difficulty';
import { getRandomInt } from '@/lib/utils/get-random-number';
import { suffleArray } from '@/lib/utils/shuffle-array';
import { readCoordinateByGridIdx, readGridCol, readGridRow } from '../grid/grid';
import type { Option } from '@/lib/types/option';

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

	// starting filling from 1st element of 2nd subgrid as diagonal values were filled
	if (solvePuzzle(grid, 0, SUB_GRID_SIZE)) return grid;

	throw new IncorrectGridError(grid);
}

/**
 * Mutatest passed puzzle.
 *
 * Recursively fills empty cells in a Sudoku grid.
 * Attempts to fill each empty cell with a valid number that satisfies Sudoku rules.
 * Uses backtracking - if a number doesn't work, tries the next number or backtracks to previous cells.
 */
export function solvePuzzle(p: PuzzleUnsolved, rowIdx: number, colIdx: number): p is PuzzleSolved {
	if (rowIdx >= GRID_SIZE) return true;

	const cellIdx = rowIdx * GRID_SIZE + colIdx;
	const nextRowIdx = colIdx === GRID_SIZE - 1 ? rowIdx + 1 : rowIdx;
	const nextColIdx = (colIdx + 1) % GRID_SIZE;

	if (p[cellIdx]) {
		return solvePuzzle(p, nextRowIdx, nextColIdx);
	}

	for (let num = 1; num <= GRID_SIZE; num++) {
		p[cellIdx] = num;

		if (isValueCorrectForCellAtPosition(p, rowIdx, colIdx)) {
			if (solvePuzzle(p, nextRowIdx, nextColIdx)) return true;
		}
	}

	p[cellIdx] = undefined;

	return false;
}

/**
 * Creates unsolved sudoku puzzle with unique solution.
 */
export function createUnsolvedPuzzle(
	p: Readonly<PuzzleSolved>,
	pdl: PuzzleDifficultyLevel,
): Readonly<PuzzleUnsolved> {
	const pu = structuredClone<PuzzleUnsolved>(p);
	const [low, high] = TOTAL_GIVEN_CELLS_RANGE_BY_DIFFICULTY_LEVEL[pdl];
	const minimumHintsCount = low + getRandomInt(high - low);
	const minimumHintsInRowAndColumnCount =
		LOWER_BOUND_OF_GIVEN_CELLS_IN_ROW_AND_COLUMN_BY_DIFFICULTY_LEVEL[pdl];

	/** Collection of indexes to remove */
	const traverseIdxs = suffleArray(Array.from({ length: GRID_CELLS_COUNT }, (_, idx) => idx));

	let savedDigit: Option<number>;
	let stepsCount = GRID_CELLS_COUNT;
	let coordinates: Option<GridCellCoordinates>;
	for (const idx of traverseIdxs) {
		coordinates = readCoordinateByGridIdx(idx);
		savedDigit = pu[idx];
		pu[idx] = undefined;

		if (
			readGridRow(pu, coordinates.rowIdx).length >= minimumHintsCount &&
			readGridCol(pu, coordinates.rowIdx).length >= minimumHintsCount &&
			hasUniqueSolution(pu)
		) {
			stepsCount--;

			if (stepsCount <= minimumHintsCount) {
				return pu;
			}

			continue;
		} else {
			pu[idx] = savedDigit;
		}
	}
}

export function hasUniqueSolution(p: Readonly<PuzzleUnsolved>): boolean {
	const copyP = structuredClone(p);

	return false;
}

export function isValueValid(
	p: PuzzleSolved,
	rowIdx: number,
	colIdx: number,
	value: number,
): boolean {
	return readGridCell(p, rowIdx, colIdx) === value;
}

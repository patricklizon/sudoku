/**
 * @module sudoku/puzzle/cell-removing
 * @see https://zhangroup.aporc.org/images/files/Paper_3485.pdf
 *
 * Different approaches to removing cells from PuzzleSolution.
 */

import type { Option } from '@/lib/types/option';
import { shuffleArray } from '@/lib/utils/to-shuffled-array';
import {
	GRID_CELLS_COUNT,
	GRID_SIZE,
	isGridCellEmpty,
	isGridCellFilled,
	readAllowedGridCellValuesAtCoordinates,
	readCoordinatesByGridCellIndex,
	readGridCol,
	readGridRow,
	type GridCell,
	type GridCellCoordinates,
} from '@/lib/sudoku/grid';
import type { Puzzle } from '@/lib/sudoku/puzzle/types';
import { PuzzleGenerationError } from '@/lib/sudoku/puzzle/errors';

export type Config = { minimumGivenCells: { row: number; col: number; total: number } };

/**
 * Mutates passed puzzle.
 */
export type CellRemovingFn = (puzzle: Puzzle, config: Config) => void;

/**
 * Mutates passed puzzle.
 */
export const removeCellsRandomly: CellRemovingFn = (puzzle, config) => {
	const idxs = shuffleArray(Array.from({ length: GRID_CELLS_COUNT }, (_, idx) => idx));

	let cellCopy: GridCell;
	let stepsCount = idxs.length;
	let coordinates: GridCellCoordinates;

	for (const idx of idxs) {
		coordinates = readCoordinatesByGridCellIndex(idx);
		cellCopy = puzzle[idx];
		puzzle[idx] = undefined;

		if (
			isRowAndColMinimumCellCountSatisfied(config, puzzle, coordinates) &&
			hasUniqueSolution(puzzle)
		) {
			stepsCount--;

			if (stepsCount <= config.minimumGivenCells.total) return;
			else continue;
		} else {
			puzzle[idx] = cellCopy;
		}
	}

	throw new PuzzleGenerationError(puzzle);
};

/**
 * Mutates passed puzzle.
 */
export const removeCellsJumpingByOneCell: CellRemovingFn = (puzzle, config) => {
	const lastIdx = GRID_SIZE - 1;

	let idx = 0;
	let cellCopy: Option<GridCell>;
	let filledCellCount = GRID_CELLS_COUNT - 1;
	let coordinates: Option<GridCellCoordinates>;

	while (filledCellCount > config.minimumGivenCells.total && idx < GRID_CELLS_COUNT) {
		coordinates = readCoordinatesByGridCellIndex(idx);
		cellCopy = puzzle[idx];
		puzzle[idx] = undefined;

		if (
			isRowAndColMinimumCellCountSatisfied(config, puzzle, coordinates) &&
			hasUniqueSolution(puzzle)
		) {
			filledCellCount--;
		} else puzzle[idx] = cellCopy;

		if (coordinates.rowIdx % 2) {
			if (coordinates.colIdx === 1) idx = idx + lastIdx;
			else idx -= 2;
		} else {
			if (coordinates.colIdx === lastIdx) idx = idx + lastIdx;
			else idx += 2;
		}
	}

	if (filledCellCount <= config.minimumGivenCells.total) return;

	const nonEmptyIdxCollection = shuffleArray(
		puzzle.reduce<number[]>((acc, cell, idx) => {
			if (isGridCellEmpty(cell)) return acc;
			acc.push(idx);
			return acc;
		}, []),
	);

	for (const nonEmptyIdx of nonEmptyIdxCollection) {
		idx = nonEmptyIdx;
		if (filledCellCount <= config.minimumGivenCells.total) return;

		coordinates = readCoordinatesByGridCellIndex(nonEmptyIdx);
		cellCopy = puzzle[idx];
		puzzle[idx] = undefined;

		if (
			isRowAndColMinimumCellCountSatisfied(config, puzzle, coordinates) &&
			hasUniqueSolution(puzzle)
		) {
			filledCellCount--;
		} else puzzle[idx] = cellCopy;
	}

	throw new PuzzleGenerationError(puzzle);
};

/**
 * Mutates passed puzzle.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-function
export const removeCellsWanderingAlongS: CellRemovingFn = (puzzle, config) => {
	throw new PuzzleGenerationError(puzzle);
};

/**
 * Mutates passed puzzle.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-function
export const removeCellsLeftToRightThenTopToBottom: CellRemovingFn = (puzzle, config) => {
	throw new PuzzleGenerationError(puzzle);
};

export function isRowAndColMinimumCellCountSatisfied(
	config: Readonly<Config>,
	puzzle: Readonly<Puzzle>,
	coordinates: Readonly<GridCellCoordinates>,
): boolean {
	return (
		readGridRow(puzzle, coordinates).filter(isGridCellFilled).length >=
			config.minimumGivenCells.row &&
		readGridCol(puzzle, coordinates).filter(isGridCellFilled).length >= config.minimumGivenCells.col
	);
}

export function hasUniqueSolution(puzzle: Readonly<Puzzle>): boolean {
	let solutionCount = 0;
	return execute(structuredClone(puzzle), 0);

	function execute(p: Puzzle, idx: number): boolean {
		if (p.every(isGridCellFilled)) solutionCount++;
		if (solutionCount > 1) return false;

		while (idx < p.length && isGridCellFilled(p[idx])) idx++;
		if (idx >= p.length) return solutionCount === 1;

		for (const val of readAllowedGridCellValuesAtCoordinates(
			p,
			readCoordinatesByGridCellIndex(idx),
		)) {
			p[idx] = val;
			if (!execute(p, idx + 1)) return false;
			p[idx] = undefined;
		}

		return true;
	}
}

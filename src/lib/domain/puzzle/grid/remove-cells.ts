/**
 * @module sudoku/puzzle/cell-removing
 * @see https://zhangroup.aporc.org/images/files/Paper_3485.pdf
 *
 * Different ways of removing cells from {@link PuzzleSolution}.
 */

import {
	GRID_CELL_COUNT,
	GRID_CELL_INDEXES,
	GRID_SIZE,
	GRID_SIZE_INDEXES,
	hasUniqueSolution,
	isGridCellFilled,
	mapGridCellIndexToCoordinates,
	readGridColumnAt,
	readGridRowCellsAt,
	type Grid,
	type GridCellCoordinates,
	type GridFilled,
} from "#src/lib/domain/puzzle/grid";
import { isEven } from "#src/lib/utils/is-even";
import { isNil } from "#src/lib/utils/is-nil";
import { toShuffledArray } from "#src/lib/utils/to-shuffled-array";
import type { DeepReadonly } from "#src/lib/utils/types/deep-readonly";
import type { Range } from "#src/lib/utils/types/range";

export type Config = DeepReadonly<{
	minimumGivenCells: {
		row: number;
		col: number;
		total: { count: number; range: Range<number> };
	};
	indexes: number[];
}>;

export function removeGridCells(grid: Readonly<GridFilled>, config: Config): Grid {
	_assertConfigCorrectness(config);

	const gridCopy = structuredClone(grid as Grid);
	let removedCount = 0;
	const targetEmptyCellCount = GRID_CELL_COUNT - config.minimumGivenCells.total.count;

	execute(config.indexes);

	// try removing randomly remaining cells
	if (removedCount < targetEmptyCellCount) {
		const nonEmptyIndexes = gridCopy.reduce<number[]>((acc, it, gcIdx) => {
			if (isNil(it)) return acc;
			acc.push(gcIdx);
			return acc;
		}, []);

		execute(nonEmptyIndexes);
	}

	if (_isRemovedCellCountWithinRequestedConstrains(config, removedCount)) {
		return gridCopy;
	}

	throw new Error("Failed to meet the minimum given cell constraint");

	function execute(indexes: readonly number[]): void {
		for (const idx of indexes) {
			if (removedCount >= targetEmptyCellCount) break;

			const originalValue = gridCopy.at(idx);
			gridCopy[idx] = undefined;
			const coordinates = mapGridCellIndexToCoordinates(idx);

			if (
				_isRowAndColMinimumCellCountSatisfied(config, gridCopy, coordinates) &&
				hasUniqueSolution(gridCopy)
			) {
				removedCount++;
			} else {
				gridCopy[idx] = originalValue;
			}
		}
	}
}

export function pickIndexOrderRandomly(): readonly number[] {
	return toShuffledArray(GRID_CELL_INDEXES);
}

export function pickIndexOrderJumpingByOneCell(): readonly number[] {
	const result: number[] = [];
	const rowLastIdx = GRID_SIZE - 1;
	const jumpByIdx = 2;

	let coordinates: Option<GridCellCoordinates>;
	let idx = 0;
	while (idx < GRID_CELL_COUNT) {
		result.push(idx);
		coordinates = mapGridCellIndexToCoordinates(idx);

		if (isEven(coordinates.rowIdx)) {
			if (coordinates.colIdx === GRID_SIZE_INDEXES.at(-2)) idx += rowLastIdx;
			else idx += jumpByIdx;
		} else {
			if (coordinates.colIdx === GRID_SIZE_INDEXES.at(1)) idx += rowLastIdx;
			else idx -= jumpByIdx;
		}
	}

	return result.concat(
		result.reduce<number[]>((acc, it) => {
			if (it === 0) return acc;
			acc.push(it - 1);
			return acc;
		}, []),
	);
}

export function pickIndexOrderWanderingAlongS(): readonly number[] {
	const result: number[] = [];

	let coordinates: Option<GridCellCoordinates>;
	let idx = 0;
	while (idx < GRID_CELL_COUNT) {
		result.push(idx);
		coordinates = mapGridCellIndexToCoordinates(idx);

		if (isEven(coordinates.rowIdx)) {
			if (coordinates.colIdx === GRID_SIZE_INDEXES.at(-1)) idx += GRID_SIZE;
			else idx++;
		} else {
			if (coordinates.colIdx === GRID_SIZE_INDEXES.at(0)) idx += GRID_SIZE;
			else idx--;
		}
	}

	return result;
}

export function pickIndexOrderLeftToRightThenTopToBottom(): readonly number[] {
	return [...GRID_CELL_INDEXES];
}

/**
 * @private
 */
export function _isRowAndColMinimumCellCountSatisfied(
	config: Readonly<Config>,
	g: Readonly<Grid>,
	coordinates: Readonly<GridCellCoordinates>,
): boolean {
	return (
		readGridRowCellsAt(g, coordinates).filter(isGridCellFilled).length >=
			config.minimumGivenCells.row &&
		readGridColumnAt(g, coordinates).filter(isGridCellFilled).length >= config.minimumGivenCells.col
	);
}

/**
 * @private
 */
export function _assertConfigCorrectness(config: Config): void {
	if (
		config.minimumGivenCells.total.count <
		GRID_SIZE * Math.max(config.minimumGivenCells.row, config.minimumGivenCells.col)
	) {
		// TODO: implement error
		throw new Error("Configuraion's constrains cold not be satisfied");
	}
}

/**
 * @private
 */
export function _isRemovedCellCountWithinRequestedConstrains(
	config: Config,
	removedCount: number,
): boolean {
	const rc = _countRemainingGridCells(removedCount);
	if (rc < config.minimumGivenCells.total.count) return false;

	const [min, max] = config.minimumGivenCells.total.range;
	return min <= rc && rc <= max;
}

function _countRemainingGridCells(removed: number): number {
	return GRID_CELL_COUNT - removed;
}

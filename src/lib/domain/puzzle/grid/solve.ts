import { isNumber } from '@/lib/utils/is-number';
import { isDefined } from '@/lib/utils/is-defined';
import type { ConstructionGrid, Grid, GridFilled, GridCellCoordinates } from './types';
import {
	mapGridIndexToCoordinates,
	readAllowedGridCellValuesAt,
	readColCellIndexesAt,
	readRowCellIndexesAt,
	readCellIndexesOfSubGridAt,
} from './grid';
import { isNil } from '@/lib/utils/is-nil';
import type { Option } from '@/lib/utils/types/option';
import { UnableToPopulateGridWithValuesError } from './errors';

/**
 * Creates filled grid.
 */
export function solve(g: Grid): GridFilled {
	const grid: ConstructionGrid = g.map((it, idx) => {
		return isDefined(it) ? it : readAllowedGridCellValuesAt(g, mapGridIndexToCoordinates(idx));
	});

	if (execute(grid)) return grid;

	throw new UnableToPopulateGridWithValuesError(grid);

	function execute(cg: ConstructionGrid): cg is GridFilled {
		const idx = findCellIdxWithSmallestCountOfPossibleValues(cg) ?? 0;
		const cell = cg[idx];

		// TODO: Add errors
		if (isNil(cell)) throw new Error('shouod never happen');
		if (isNumber(cell)) return true;

		const coordinates = mapGridIndexToCoordinates(idx);

		const stableOrder = [...cell];
		for (const value of stableOrder) {
			cg[idx] = value;
			_updateCellsPossibleValuesAffectedByCellValueAt(cg, coordinates);

			if (execute(cg)) return true;
		}

		cg[idx] = cell;
		_updateCellsPossibleValuesAffectedByCellValueAt(cg, coordinates);

		return false;
	}
}

/**
 * Verifies if given grid has unique solution
 */
export function hasUniqueSolution(g: Grid): boolean {
	const grid: ConstructionGrid = g.map((it, idx) => {
		return isDefined(it) ? it : readAllowedGridCellValuesAt(g, mapGridIndexToCoordinates(idx));
	});

	let solutionCount = 0;
	let shouldContinue = true;

	execute(grid);

	return solutionCount === 1;

	function execute(cg: ConstructionGrid): void {
		if (!shouldContinue) return;

		const idx = findCellIdxWithSmallestCountOfPossibleValues(cg) ?? 0;
		const cell = cg[idx];

		// TODO: Add errors
		if (isNil(cell)) throw new Error('shouod never happen');
		if (isNumber(cell)) {
			solutionCount += 1;
			if (solutionCount > 1) shouldContinue = false;
			return;
		}

		const coordinates = mapGridIndexToCoordinates(idx);

		const stableOrder = [...cell];
		for (const value of stableOrder) {
			cg[idx] = value;
			_updateCellsPossibleValuesAffectedByCellValueAt(cg, coordinates);
			execute(cg);
		}
	}
}

/**
 * Findes index of {@link GridCellValue} with smalles count of possible valid values,
 * which is a good candidate for next element to try.
 */
export function findCellIdxWithSmallestCountOfPossibleValues(g: ConstructionGrid): Option<number> {
	let smallestSize = Number.MAX_SAFE_INTEGER;
	let result: Option<number>;

	for (const [idx, it] of g.entries()) {
		if (isNumber(it) || isNil(it)) continue;
		if (smallestSize <= it.size) continue;
		smallestSize = it.size;
		result = idx;
	}

	return result;
}

/**
 * @private
 *
 * Modifies possible values of cells that were affected by changing value at given index.
 * In all cases affected cells are within {@link SubGrid}, {@link GridRow}, and {@link GridCol}
 */
export function _updateCellsPossibleValuesAffectedByCellValueAt(
	cg: ConstructionGrid,
	coordinates: GridCellCoordinates,
): void {
	const affectedIdxs = readCellIndexesOfSubGridAt(coordinates)
		.union(readRowCellIndexesAt(coordinates))
		.union(readColCellIndexesAt(coordinates));

	let cell: Option<ConstructionGrid[number]>;
	for (const aIdx of affectedIdxs) {
		cell = cg.at(aIdx);
		// TODO: add errors
		if (isNil(cell)) throw new Error('should never happen');
		if (isNumber(cell)) continue;

		cell.clear();
		for (const allowed of readAllowedGridCellValuesAt(cg, mapGridIndexToCoordinates(aIdx))) {
			cell.add(allowed);
		}
	}
}

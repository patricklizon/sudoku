import { isDefined } from "#src/lib/utils/is-defined";
import { isNil } from "#src/lib/utils/is-nil";
import { isNumber } from "#src/lib/utils/is-number";
import type { Option } from "#src/lib/utils/types/option";
import { UnableToFillGridWithValuesError } from "./errors";
import {
	getAllowedGridCellValuesAt,
	readGridColumnCellIndexesAt,
	readGridRowCellIndexesAt,
	readGridCellIndexesOfGridBoxAt,
} from "./grid";
import { mapGridCellIndexToCoordinates } from "./mappers";
import type {
	Grid,
	GridFilled,
	GridCellFilled,
	GridCellCoordinates,
	GridCellEmptyWithPossibleValues,
} from "./types";

/**
 * Creates filled grid.
 */
export function solve(g: Readonly<Grid>): GridFilled {
	const grid = g.map((it, idx) => {
		return isDefined(it) ? it : getAllowedGridCellValuesAt(g, mapGridCellIndexToCoordinates(idx));
	}) as Grid<GridCellEmptyWithPossibleValues | GridCellFilled>;

	if (execute(grid)) return grid;

	throw new UnableToFillGridWithValuesError(grid);

	function execute(cg: Grid<GridCellEmptyWithPossibleValues | GridCellFilled>): cg is GridFilled {
		const idx = findCellIdxWithSmallestCountOfPossibleValues(cg) ?? 0;
		const cell = cg.at(idx);

		// TODO: Add errors
		if (isNil(cell)) throw new Error("shouod never happen");
		if (isNumber(cell)) return true;

		const coordinates = mapGridCellIndexToCoordinates(idx);

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
export function hasUniqueSolution(g: Readonly<Grid>): boolean {
	const grid = g.map((it, idx) => {
		return isDefined(it) ? it : getAllowedGridCellValuesAt(g, mapGridCellIndexToCoordinates(idx));
	}) as Grid<GridCellEmptyWithPossibleValues | GridCellFilled>;

	let solutionCount = 0;
	let shouldContinue = true;

	execute(grid);

	return solutionCount === 1;

	function execute(cg: Grid<GridCellEmptyWithPossibleValues | GridCellFilled>): void {
		if (!shouldContinue) return;

		const idx = findCellIdxWithSmallestCountOfPossibleValues(cg) ?? 0;
		const cell = cg.at(idx);

		// TODO: Add errors
		if (isNil(cell)) throw new Error("should never happen");
		if (isNumber(cell)) {
			solutionCount++;
			if (solutionCount > 1) shouldContinue = false;
			return;
		}

		const coordinates = mapGridCellIndexToCoordinates(idx);

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
export function findCellIdxWithSmallestCountOfPossibleValues(
	g: Readonly<Grid<GridCellEmptyWithPossibleValues | GridCellFilled>>,
): Option<number> {
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
 * In all cases affected cells are within {@link GridBox}, {@link GridRow}, and {@link GridColumn}
 */
export function _updateCellsPossibleValuesAffectedByCellValueAt(
	cg: Readonly<Grid<GridCellEmptyWithPossibleValues | GridCellFilled>>,
	coordinates: GridCellCoordinates,
): void {
	const affectedIdxs = readGridCellIndexesOfGridBoxAt(coordinates)
		.union(readGridRowCellIndexesAt(coordinates))
		.union(readGridColumnCellIndexesAt(coordinates));

	let cell: Option<Grid<GridCellEmptyWithPossibleValues | GridCellFilled>[number]>;
	for (const aIdx of affectedIdxs) {
		cell = cg.at(aIdx);
		// TODO: add errors
		if (isNil(cell)) throw new Error("should never happen");
		if (isNumber(cell)) continue;

		cell.clear();
		for (const allowed of getAllowedGridCellValuesAt(cg, mapGridCellIndexToCoordinates(aIdx))) {
			cell.add(allowed);
		}
	}
}

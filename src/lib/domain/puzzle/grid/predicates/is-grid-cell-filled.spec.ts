import { describe, test, expect } from "vitest";
import { GRID_CELL_ALLOWED_VALUES } from "#lib/domain/puzzle/grid/constants";
import { isGridCellFilled } from "./is-grid-cell-filled";

describe("#" + isGridCellFilled.name, () => {
	test.each([...GRID_CELL_ALLOWED_VALUES])("returns true when cell has allowed value", (value) => {
		expect(isGridCellFilled(value)).toEqual(true);
	});

	test.each([undefined, null])("returns false when cell does not have value", (value) => {
		expect(isGridCellFilled(value)).toEqual(false);
	});

	test.each([-1, 10])("returns false when cell has illegal value", (value) => {
		expect(isGridCellFilled(value)).toEqual(false);
	});
});

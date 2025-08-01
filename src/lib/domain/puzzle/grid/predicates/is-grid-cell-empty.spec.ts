import { describe, expect, test } from "vitest";
import { isGridCellEmpty } from "./is-grid-cell-empty";

describe("#" + isGridCellEmpty.name, () => {
	test.each([undefined, null])("returns true when cell is empty", (value) => {
		expect(isGridCellEmpty(value)).to.equal(true);
	});

	test.each([0, 2])("returns false when cell has value", (value) => {
		expect(isGridCellEmpty(value)).to.equal(false);
	});
});

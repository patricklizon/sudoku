import { getAllowedGridCellValuesAt } from "#src/lib/domain/puzzle/grid/grid";
import { isGridCellFilled } from "#src/lib/domain/puzzle/grid/predicates/is-grid-cell-filled";
import type { Grid, GridWithPossibleValues } from "#src/lib/domain/puzzle/grid/types";
import { mapGridCellIndexToCoordinates } from "./map-grid-cell-index-to-coordinates";

export function mapGridToGridWithPossibleValues(g: Readonly<Grid>): GridWithPossibleValues {
	return g.map((it, idx) => {
		return isGridCellFilled(it)
			? it
			: getAllowedGridCellValuesAt(g, mapGridCellIndexToCoordinates(idx));
	}) as GridWithPossibleValues;
}

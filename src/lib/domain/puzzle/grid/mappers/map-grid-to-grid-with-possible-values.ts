import { getAllowedGridCellValuesAt } from '../grid';
import { isGridCellFilled } from '../predicates';
import type { Grid, GridWithPossibleValues } from '../types';

import { mapGridCellIndexToCoordinates } from './map-grid-cell-index-to-coordinates';

export function mapGridToGridWithPossibleValues(g: Readonly<Grid>): GridWithPossibleValues {
	return g.map((it, idx) => {
		return isGridCellFilled(it)
			? it
			: getAllowedGridCellValuesAt(g, mapGridCellIndexToCoordinates(idx));
	}) as GridWithPossibleValues;
}

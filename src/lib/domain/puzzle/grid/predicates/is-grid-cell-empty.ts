import type { GridCellEmpty } from "#lib/domain/puzzle/grid/types";
import { isNil } from "#lib/utils/is-nil";

export function isGridCellEmpty(it: unknown): it is GridCellEmpty {
	return isNil(it);
}

import type { GridCellEmpty } from "#src/lib/domain/puzzle/grid/types";
import { isNil } from "#src/lib/utils/is-nil";

export function isGridCellEmpty(it: unknown): it is GridCellEmpty {
	return isNil(it);
}

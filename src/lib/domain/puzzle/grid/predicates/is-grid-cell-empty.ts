import { isNil } from "#src/lib/utils/is-nil";
import type { GridCellEmpty } from "../types";


export function isGridCellEmpty(it: unknown): it is GridCellEmpty {
	return isNil(it);
}

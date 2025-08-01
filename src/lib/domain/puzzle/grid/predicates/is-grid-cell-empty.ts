import type { GridCellEmpty } from '../types';

import { isNil } from '#src/lib/utils/is-nil';

export function isGridCellEmpty(it: unknown): it is GridCellEmpty {
	return isNil(it);
}

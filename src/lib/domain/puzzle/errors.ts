import { type Grid, debug } from './grid';

import type { AnyRecord } from '@/lib/utils/types/record';

export class PuzzleGenerationError extends Error {
	constructor(grid: Grid, record: AnyRecord, removedCount: number) {
		super(
			`It was not possible to generate puzzle for grid: ${debug(grid)} \n\nremoved count: ${removedCount.toString()} \n\n${JSON.stringify(record, undefined, '\t')}`,
		);
	}
}

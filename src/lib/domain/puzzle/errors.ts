import { gridDebugFormatter } from "#src/lib/domain/puzzle/grid/debug-formatter";
import type { Grid } from "#src/lib/domain/puzzle/grid/types";

export class PuzzleGenerationError extends Error {
	constructor(grid: Grid, record: AnyRecord, removedCount: number) {
		super(
			`It was not possible to generate puzzle for grid: ${gridDebugFormatter(grid)} \n\nremoved count: ${removedCount.toString()} \n\n${JSON.stringify(record, undefined, "\t")}`,
		);
	}
}

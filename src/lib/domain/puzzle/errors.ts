import { type Grid, prettyDebug } from './grid';

export class PuzzleGenerationError extends Error {
	constructor(grid: Grid) {
		super(`It was not possible to generate puzzle for grid: ${prettyDebug(grid)}`);
	}
}

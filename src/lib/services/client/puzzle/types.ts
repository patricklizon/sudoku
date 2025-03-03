import type { PuzzleDifficultyLevel, Puzzle } from '$lib/domain/puzzle';
import type { WorkerRequest, WorkerResponse } from '$lib/utils/types/worker';

export type CreatePuzzleWorkerRequest = WorkerRequest<
	'@sudoku/request/puzzle/create/one',
	{ difficulty: PuzzleDifficultyLevel }
>;

export type CreatePuzzleWorkerResponse = WorkerResponse<{ puzzle: Puzzle }>;

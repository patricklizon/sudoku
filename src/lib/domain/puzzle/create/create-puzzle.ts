import type { PuzzleDifficultyLevel } from '@/lib/domain/puzzle-difficulty';
import type { Puzzle } from '@/lib/domain/puzzle/types';
import { createPuzzleProblem } from '@/lib/domain/puzzle/create/create-puzzle-problem';
import { createPuzzleSolution } from '@/lib/domain/puzzle/create/create-puzzle-solution';
import { encodePuzzle } from '@/lib/domain/puzzle/encoder';

export function createPuzzle(difficulty: PuzzleDifficultyLevel): Puzzle {
	const solution = createPuzzleSolution();
	const problem = createPuzzleProblem(solution, difficulty);
	const id = encodePuzzle(problem, solution);

	return {
		difficulty,
		id,
	};
}

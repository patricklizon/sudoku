import { encodePuzzle } from '@/lib/domain/puzzle/encoder';
import { createPuzzleProblem } from '@/lib/domain/puzzle/problem/create-puzzle-problem';
import { createPuzzleSolution } from '@/lib/domain/puzzle/solution/create-puzzle-solution';
import type { Puzzle, PuzzleDifficultyLevel } from '@/lib/domain/puzzle/types';

export function createPuzzle(difficulty: PuzzleDifficultyLevel): Puzzle {
	const solution = Object.freeze(createPuzzleSolution());
	const problem = createPuzzleProblem(solution, difficulty);
	const id = encodePuzzle(problem, solution, difficulty);

	return {
		problem,
		solution,
		difficulty,
		id,
	};
}

import type { Puzzle, PuzzleDifficultyLevel } from '@/lib/domain/puzzle/types';
import { createPuzzleProblem } from '@/lib/domain/puzzle/problem/create-puzzle-problem';
import { createPuzzleSolution } from '@/lib/domain/puzzle/solution/create-puzzle-solution';
import { encodePuzzle } from '@/lib/domain/puzzle/encoder';

export function createPuzzle(difficulty: PuzzleDifficultyLevel): Puzzle {
	const solution = createPuzzleSolution();
	const problem = createPuzzleProblem(solution, difficulty);
	const id = encodePuzzle(problem, solution, difficulty);

	return {
		problem,
		solution,
		difficulty,
		id,
	};
}

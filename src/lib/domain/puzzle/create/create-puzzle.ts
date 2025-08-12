import { encodePuzzle } from "#src/lib/domain/puzzle/encoder";
import { createPuzzleProblem } from "#src/lib/domain/puzzle/problem/create-puzzle-problem";
import { createPuzzleSolution } from "#src/lib/domain/puzzle/solution/create-puzzle-solution";
import type { Puzzle, PuzzleDifficultyLevel } from "#src/lib/domain/puzzle/types";

export function createPuzzle(difficulty: PuzzleDifficultyLevel): Puzzle {
	const solution = createPuzzleSolution();
	const problem = createPuzzleProblem(solution, difficulty);
	const id = encodePuzzle(problem, solution, difficulty);

	return {
		problem,
		solution,
		difficultyLevel: difficulty,
		id,
	};
}

import { describe, expect, test } from "vitest";
import { DIFFICULTY_LEVEL } from "#src/lib/domain/puzzle/difficulty";
import { encodePuzzle } from "#src/lib/domain/puzzle/encoder";
import { createEmptyGridCell } from "#src/lib/domain/puzzle/grid";
import type { PuzzleProblem, PuzzleSolution } from "#src/lib/domain/puzzle/types";

describe("#" + encodePuzzle.name, () => {
	const _ = createEmptyGridCell();
	const solution = [
		[2, 4, 6, 5, 1, 3, 7, 9, 8],
		[3, 1, 9, 2, 8, 7, 5, 4, 6],
		[7, 5, 8, 4, 9, 6, 1, 2, 3],
		[1, 9, 4, 8, 2, 5, 6, 3, 7],
		[8, 3, 7, 1, 6, 9, 2, 5, 4],
		[5, 6, 2, 3, 7, 4, 8, 1, 9],
		[9, 2, 1, 7, 3, 8, 4, 6, 5],
		[4, 8, 3, 6, 5, 2, 9, 7, 1],
		[6, 7, 5, 9, 4, 1, 3, 8, 2],
	].flat() as PuzzleSolution;

	const puzzle = [
		[2, 4, 6, 5, 1, 3, 7, 9, _],
		[3, 1, _, 2, 8, _, 5, _, _],
		[7, 5, 8, 4, 9, _, 1, 2, 3],
		[1, 9, 4, 8, 2, _, _, _, _],
		[8, 3, _, 1, _, 9, 2, 5, _],
		[_, _, _, 3, 7, 4, 8, _, 9],
		[9, _, 1, _, _, 8, 4, 6, 5],
		[4, 8, 3, _, 5, 2, 9, _, 1],
		[6, 7, _, 9, 4, 1, 3, 8, 2],
	].flat() as PuzzleProblem;

	const difficultyLevel = DIFFICULTY_LEVEL[4];
	const encoded =
		"24651379H31I28G5DF75849F12319482EFCG83G1F925DEFB3748A99B1GC8465483F529G167E941382" +
		difficultyLevel;

	test("encodes puzzle and solution into an URL safe string", () => {
		const result = encodePuzzle(puzzle, solution, difficultyLevel);

		expect(result).to.equal(encoded);
		expect(result).to.equal(encodeURI(encoded));
	});
});

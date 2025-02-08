import { describe, expect, test } from 'vitest';
import { hasUniqueSolution } from '@/lib/sudoku/puzzle/cell-removing';
import { createEmptyCell } from '@/lib/sudoku/grid';
import type { Puzzle } from '@/lib/sudoku/puzzle/types';

describe(hasUniqueSolution, () => {
	const _ = createEmptyCell();

	test('returns false when multiple solutions exists', () => {
		const puzzle = [
			[9, 2, 6, 5, 7, 1, 4, 8, 3],
			[3, 5, 1, 4, 8, 6, 2, 7, 9],
			[8, 7, 4, 9, 2, 3, 5, 1, 6],
			[5, 8, 2, 3, 6, 7, 1, 9, 4],
			[1, 4, 9, 2, 5, 8, 3, 6, 7],
			[7, 6, 3, 1, _, _, 8, 2, 5], // [4, 9] or [9, 4]
			[2, 3, 8, 7, _, _, 6, 5, 1], // [9, 4]    [4, 9]
			[6, 1, 7, 8, 3, 5, 9, 4, 2],
			[4, 9, 5, 6, 1, 2, 7, 3, 8],
		].flat() as Puzzle;

		expect(hasUniqueSolution(puzzle)).to.equal(false);
	});

	test('returns true when only one solution exists', () => {
		const puzzle = [
			[5, 3, _, _, 7, _, _, _, _],
			[6, _, _, 1, 9, 5, _, _, _],
			[_, 9, 8, _, _, _, _, 6, _],
			[8, _, _, _, 6, _, _, _, 3],
			[4, _, _, 8, _, 3, _, _, 1],
			[7, _, _, _, 2, _, _, _, 6],
			[_, 6, _, _, _, _, 2, 8, _],
			[_, _, _, 4, 1, 9, _, _, 5],
			[_, _, _, _, 8, _, _, 7, 9],
		].flat() as Puzzle;

		expect(hasUniqueSolution(puzzle)).to.equal(true);
	});
});

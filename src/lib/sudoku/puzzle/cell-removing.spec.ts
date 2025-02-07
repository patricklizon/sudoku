import { describe, expect, test } from 'vitest';
import { hasUniqueSolution } from '@/lib/sudoku/puzzle/cell-removing';
import { createEmptyCell } from '@/lib/sudoku/grid';
import type { Puzzle } from '@/lib/sudoku/puzzle/types';

describe(hasUniqueSolution, () => {
	const _ = createEmptyCell();

	test('returns false when multiple solutions existst', () => {
		const puzzle = [
			[1, 2, 3, _, _, _, _, _, _],
			[4, 5, 6, _, _, _, _, _, _],
			[7, 8, 9, _, _, _, _, _, _],
			[_, _, _, _, _, _, _, _, _],
			[_, _, _, _, _, _, _, _, _],
			[_, _, _, _, _, _, _, _, _],
			[_, _, _, _, _, _, _, _, _],
			[_, _, _, _, _, _, _, _, _],
			[_, _, _, _, _, _, _, _, _],
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

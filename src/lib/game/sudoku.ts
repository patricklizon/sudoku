type Nil = null | undefined;
type Digit = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
type GridField = Nil | Digit;
type GridFieldCollection = GridField[];
type GridFieldPosition = { rowIdx: number; colIdx: number };
type Grid = GridFieldCollection[];

const SUB_GRID_SIZE = 3;
const GRID_SIZE = 9;

export function createGrid(): Grid {
	for (let attempts = 0; attempts < 4; attempts++) {
		const grid = fillDiagonalSubGrids(createEmptyGrid());

		if (fillEmptySubGrids(grid, { colIdx: 0, rowIdx: 0 })) {
			return grid;
		}
	}
	throw new Error('Failed to create valid grid');
}

function fillDiagonalSubGrids(g: Grid): Grid {
	const usedDigits = new Set<Digit>();
	let nextDigit = getRandomDigit();

	for (let diagonalStartIdx = 0; diagonalStartIdx < GRID_SIZE; diagonalStartIdx += SUB_GRID_SIZE) {
		usedDigits.clear();

		for (let rowIdx = 0; rowIdx < SUB_GRID_SIZE; rowIdx++) {
			for (let colIdx = 0; colIdx < SUB_GRID_SIZE; colIdx++) {
				while (usedDigits.has(nextDigit)) nextDigit = getRandomDigit();
				usedDigits.add(nextDigit);
				g[rowIdx + diagonalStartIdx][colIdx + diagonalStartIdx] = nextDigit;
			}
		}
	}

	return g;
}

function getRandomDigit(): Digit {
	return (Math.floor(Math.random() * GRID_SIZE) + 1) as Digit;
}

function fillEmptySubGrids(grid: Grid, position: GridFieldPosition): boolean {
	if (position.rowIdx >= GRID_SIZE) return true;

	const nextPosition: GridFieldPosition = {
		rowIdx: position.colIdx === GRID_SIZE - 1 ? position.rowIdx + 1 : position.rowIdx,
		colIdx: (position.colIdx + 1) % GRID_SIZE,
	};

	if (grid[position.rowIdx][position.colIdx] !== undefined) {
		return fillEmptySubGrids(grid, nextPosition);
	}

	for (let num = 1; num <= GRID_SIZE; num++) {
		grid[position.rowIdx][position.colIdx] = num as Digit;

		if (isFieldPositionCorrect(grid, position)) {
			if (fillEmptySubGrids(grid, nextPosition)) {
				return true;
			}
		}
	}

	grid[position.rowIdx][position.colIdx] = undefined;
	return false;
}

function isFieldPositionCorrect(grid: Grid, position: GridFieldPosition): boolean {
	const row = grid[position.rowIdx];
	if (hasDuplicates(row)) return false;

	const col = grid.map((r) => r[position.colIdx]);
	if (hasDuplicates(col)) return false;

	const boxValues = getSubGridFields(grid, position);
	if (hasDuplicates(boxValues)) return false;

	return true;
}

function hasDuplicates<T extends string | number | Nil>(c: T[] | Readonly<T[]>): boolean {
	const numbers = c.filter((it) => !!it);
	const set = new Set(numbers);
	return set.size !== numbers.length;
}

function getSubGridFields(grid: Grid, position: GridFieldPosition): GridField[] {
	const boxStartRow = Math.floor(position.rowIdx / SUB_GRID_SIZE) * SUB_GRID_SIZE;
	const boxStartCol = Math.floor(position.colIdx / SUB_GRID_SIZE) * SUB_GRID_SIZE;

	const values: GridField[] = [];
	for (let i = 0; i < SUB_GRID_SIZE; i++) {
		for (let j = 0; j < SUB_GRID_SIZE; j++) {
			values.push(grid[boxStartRow + i][boxStartCol + j]);
		}
	}
	return values;
}

function createEmptyGrid(): Grid {
	return Array.from({ length: GRID_SIZE }, createEmptyGridFieldCollectoin) as Grid;
}

function createEmptyGridFieldCollectoin(): GridFieldCollection {
	return Array.from({ length: GRID_SIZE }, () => undefined) as GridFieldCollection;
}

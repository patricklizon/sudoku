import type { Option } from '@/lib/types/option';
import { GRID_SIZE, SUB_GRID_CELLS_COUNT, SUB_GRID_SIZE } from './grid';

const COLOR = {
	blue: '\x1b[38;5;69m',
	yellow: '\x1b[38;5;136m',
	orange: '\x1b[38;5;208m',
	suffix: '\x1b[0m',
};

function colorLog(color: Exclude<keyof typeof COLOR, 'suffix'>, s: string): string {
	return COLOR[color] + s + COLOR.suffix;
}

/**
 * Prints formatted grid.
 */
export function prettyDebug(
	g: Option<number>[],
	hilight?: Partial<{ rowIdx: number; colIdx: number }>,
): string {
	const isSubGrid = g.length === SUB_GRID_CELLS_COUNT;
	const breakAtIdx = isSubGrid ? SUB_GRID_SIZE : GRID_SIZE;

	const formattedGrid = g
		.map((it, idx) => {
			const currentRow = Math.floor(idx / breakAtIdx);
			const currentCol = idx % breakAtIdx;

			let value = it?.toString() ?? '_';

			if (hilight?.rowIdx === currentRow && hilight.colIdx === currentCol) {
				value = colorLog('orange', value);
			} else if (hilight?.rowIdx === currentRow) {
				value = colorLog('blue', value);
			} else if (hilight?.colIdx === currentCol) {
				value = colorLog('yellow', value);
			}

			return idx > 0 && !(idx % breakAtIdx) ? `\n${value}` : value;
		})
		.join(', ');

	return `[\n${formattedGrid}\n]`;
}

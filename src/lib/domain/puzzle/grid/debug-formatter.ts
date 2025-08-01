import { GRID_BOX_CELLS_COUNT, GRID_BOX_SIZE, GRID_SIZE } from "./constants";
import { isGridCellFilled } from "./predicates";
import type { Grid, GridBox, GridWithPossibleValues } from "./types";

const COLOR = {
	blue: "\u001B[38;5;69m",
	orange: "\u001B[38;5;208m",
	suffix: "\u001B[0m",
	yellow: "\u001B[38;5;136m",
};

function colorLog(color: Exclude<keyof typeof COLOR, "suffix">, s: string): string {
	return COLOR[color] + s + COLOR.suffix;
}

/**
 * Prints formatted grid.
 */
export function gridDebugFormatter(
	g: Grid | GridBox | GridWithPossibleValues,
	o?: Partial<{ hilightIdxs: number[]; displayIdxMatrix: boolean; activeIdx: number }>,
): string {
	const isGridBox = g.length === GRID_BOX_CELLS_COUNT;
	const breakAtIdx = isGridBox ? GRID_BOX_SIZE : GRID_SIZE;

	const formattedGrid = g
		.map((it, idx) => {
			let value = isGridCellFilled(it) ? it.toString() : "_";

			if (o?.hilightIdxs?.includes(idx)) value = colorLog("orange", value);
			if (o?.activeIdx === idx) value = colorLog("blue", value);

			return idx > 0 && idx % breakAtIdx === 0 ? `\n${value}` : value;
		})
		.join(", ");

	const formattedGridOfIndexes = g
		.map((_, idx) => {
			let value = idx.toString().padStart(2, "_");

			if (o?.hilightIdxs?.includes(idx)) value = colorLog("orange", value);
			if (o?.activeIdx === idx) value = colorLog("blue", value);

			return idx > 0 && idx % breakAtIdx === 0 ? `\n${value}` : value;
		})
		.join(", ");

	let result = `[\n${formattedGrid}\n]`;

	if (o?.hilightIdxs) result += `\n[\n${formattedGridOfIndexes}\n]`;

	return result;
}

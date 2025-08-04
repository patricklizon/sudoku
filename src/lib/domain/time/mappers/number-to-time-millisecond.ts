import { isSafeNumber } from "#src/lib/utils/is-safe-number";
import type { TimeSecond } from "../types";

export function mapNumberToTimeSecond(n: number): Option<TimeSecond> {
	if (!isSafeNumber(n)) return;
	return Math.trunc(n) as TimeSecond;
}

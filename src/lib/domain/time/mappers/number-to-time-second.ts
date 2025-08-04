import { isSafeNumber } from "#src/lib/utils/is-safe-number";
import type { TimeMillisecond } from "../types";

export function mapNumberToTimeMillisecond(n: number): Option<TimeMillisecond> {
	if (!isSafeNumber(n)) return;
	return Math.trunc(n) as TimeMillisecond;
}

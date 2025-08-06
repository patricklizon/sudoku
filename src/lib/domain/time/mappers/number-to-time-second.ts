import type { TimeMillisecond } from "#lib/domain/time/types";
import { isSafeNumber } from "#lib/utils/is-safe-number";

export function mapNumberToTimeMillisecond(n: number): Option<TimeMillisecond> {
	if (!isSafeNumber(n)) return;
	return Math.trunc(n) as TimeMillisecond;
}

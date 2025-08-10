import type { TimeSecond } from "#lib/domain/time/types";
import { isSafeNumber } from "#lib/utils/is-safe-number";

export function mapNumberToTimeSecond(n: number): Option<TimeSecond> {
	if (!isSafeNumber(n)) return;
	return Math.trunc(n) as TimeSecond;
}

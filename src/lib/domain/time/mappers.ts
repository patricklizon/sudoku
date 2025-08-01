import type { TimeISOString, TimeSecond } from './types';

import type { Option } from '#src/lib/utils/types/option';

export function mapDateToTimeISOString(d: Date): TimeISOString {
	return d.toISOString() as TimeISOString;
}

export function mapNumberToTimeSecond(n: number): Option<TimeSecond> {
	if (Number.isNaN(n) || !Number.isFinite(n)) return;
	return Math.trunc(n) as TimeSecond;
}

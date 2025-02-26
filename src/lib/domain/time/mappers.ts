import type { TimeISOString, TimeSecond } from './types';

export function mapDateToTimeISOString(d: Date): TimeISOString {
	return d.toISOString() as TimeISOString;
}

export function mapNumberToTimeSecond(n: number): TimeSecond {
	if (Number.isNaN(n) || !Number.isFinite(n)) throw new Error('TODO');
	return Math.trunc(n) as TimeSecond;
}

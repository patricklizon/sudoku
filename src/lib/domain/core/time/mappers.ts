import type { TimeISOString } from './types';

export function mapDateToTimeISOString(d: Date): TimeISOString {
	return d.toISOString() as TimeISOString;
}

import type { TimeISOString } from "#lib/domain/time/types";

export function mapDateToTimeISOString(d: Date): TimeISOString {
	return d.toISOString() as TimeISOString;
}

import type { TimeISOString } from "#src/lib/domain/time/types";

export function mapDateToTimeISOString(d: Date): TimeISOString {
	return d.toISOString() as TimeISOString;
}

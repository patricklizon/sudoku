export const SECOND_AS_MS = 1000;
export const MINUTE_AS_SECONDS = 60;
export const HOUR_AS_MINUTES = 60;
export const HOUR_AS_SECONDS = 60 ** 2;

const TIME_DELIMITER = ":";

export function formatSecondsAsClock(seconds: number): string {
	const s = seconds % MINUTE_AS_SECONDS;
	const m = Math.floor(seconds / MINUTE_AS_SECONDS);
	const fm = m.toString().padStart(2, "0");
	const fs = s.toString().padStart(2, "0");
	if (m < HOUR_AS_MINUTES) return fm + TIME_DELIMITER + fs;

	const h = Math.floor(s / MINUTE_AS_SECONDS);
	return h.toString() + TIME_DELIMITER + fm + TIME_DELIMITER + fs;
}

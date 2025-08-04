import { TIME_HOUR_IN_SECONDS, TIME_MINUTE_IN_SECONDS } from "#src/lib/domain/time";

const DELIMITER = ":";

export function formatSecondsToTimeString(
	seconds: number,
	opts?: { displayHourBlock: boolean },
): string {
	const s = (seconds < 1 ? 0 : seconds) % TIME_MINUTE_IN_SECONDS;
	const m = Math.floor(seconds / TIME_MINUTE_IN_SECONDS) % TIME_MINUTE_IN_SECONDS;
	const mBlock = m.toString().padStart(2, "0");
	const sBlock = s.toString().padStart(2, "0");

	const displayOnlyMinutesAndSeconds = !(opts?.displayHourBlock ?? false);
	if (displayOnlyMinutesAndSeconds && seconds < TIME_HOUR_IN_SECONDS) {
		return mBlock + DELIMITER + sBlock;
	}

	const h = Math.floor(seconds / TIME_HOUR_IN_SECONDS);

	const hBlock = h.toString().padStart(2, "0");
	return hBlock + DELIMITER + mBlock + DELIMITER + sBlock;
}

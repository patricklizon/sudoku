import { expect, test } from "vitest";
import { TIME_HOUR_IN_SECONDS, TIME_MINUTE_IN_SECONDS } from "#src/lib/domain/time/constants";
import { formatSecondsToTimeString } from "./seconds-to-time-string";

test.each<[given: number, expected: string]>([
	[0.001, "00:00"],
	[0.999, "00:00"],
	[1, "00:01"],
	[59, "00:59"],
	[TIME_MINUTE_IN_SECONDS, "01:00"],
	[TIME_MINUTE_IN_SECONDS + 1, "01:01"],
	[TIME_MINUTE_IN_SECONDS * 2, "02:00"],
	[TIME_HOUR_IN_SECONDS, "01:00:00"],
	[5 * TIME_HOUR_IN_SECONDS, "05:00:00"],
	[10 * TIME_HOUR_IN_SECONDS, "10:00:00"],
])("does not format microseconds block", (given, expected) => {
	expect(formatSecondsToTimeString(given), `given value: ${given}`).toEqual(expected);
});

test.each<[given: number, expected: string]>([
	[0, "00:00"],
	[1, "00:01"],
	[59, "00:59"],
	[TIME_MINUTE_IN_SECONDS, "01:00"],
	[TIME_MINUTE_IN_SECONDS + 1, "01:01"],
	[TIME_MINUTE_IN_SECONDS * 2, "02:00"],
	[TIME_MINUTE_IN_SECONDS * 2 + 10, "02:10"],
])("formats minutes and seconds blocks", (given, expected) => {
	expect(formatSecondsToTimeString(given), `given value: ${given}`).toEqual(expected);
});

test.each<[given: number, expected: string]>([
	[0, "00:00"],
	[1, "00:01"],
	[59, "00:59"],
	[TIME_MINUTE_IN_SECONDS, "01:00"],
	[TIME_MINUTE_IN_SECONDS + 1, "01:01"],
	[TIME_MINUTE_IN_SECONDS * 2, "02:00"],
	[TIME_MINUTE_IN_SECONDS * 2 + 10, "02:10"],
])("formats hours, minutes and seconds blocks", (given, expected) => {
	expect(formatSecondsToTimeString(given), `given value: ${given}`).toEqual(expected);
});

test.each<[given: number, expected: string]>([
	[0, "00:00:00"],
	[1, "00:00:01"],
	[59, "00:00:59"],
	[TIME_MINUTE_IN_SECONDS, "00:01:00"],
	[TIME_MINUTE_IN_SECONDS + 1, "00:01:01"],
	[TIME_MINUTE_IN_SECONDS * 2, "00:02:00"],
	[TIME_MINUTE_IN_SECONDS * 2 + 10, "00:02:10"],
])(
	"formats hours, minutes, and seconds blocks when option is selected and normally hours would not be displayed",
	(given, expected) => {
		expect(
			formatSecondsToTimeString(given, { displayHourBlock: true }),
			`given value: ${given}`,
		).toEqual(expected);
	},
);

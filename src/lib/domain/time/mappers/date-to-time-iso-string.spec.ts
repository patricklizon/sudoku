import { expect } from "@playwright/test";
import { beforeAll, test } from "vitest";
import { mapDateToTimeISOString } from "./date-to-time-iso-string";

beforeAll(() => {
	process.env.TZ = "UTC";
});

test.each([
	["10-10-2000", "2000-10-10T00:00:00.000Z"],
	["2000-10-10", "2000-10-10T00:00:00.000Z"],
])("maps date object to ISO string", (given, expected) => {
	expect(mapDateToTimeISOString(new Date(given)), `given value: ${given}`).toEqual(expected);
});

import { cleanup } from "@solidjs/testing-library";
import { beforeEach } from "vitest";

export const setup = (): void => {
	// default all tests to UTC
	process.env.TZ = "UTC";
};

beforeEach(() => {
	if ("document" in globalThis) {
		// has to be in 'before' hook to preserve DOM output in visual test runner
		cleanup();
	}
});

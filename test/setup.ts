import { cleanup } from "@solidjs/testing-library";
import { beforeEach } from "vitest";

beforeEach(() => {
	if ("document" in globalThis) {
		// has to be in 'before' hook to preserve DOM output in visual test runner
		cleanup();
	}
});

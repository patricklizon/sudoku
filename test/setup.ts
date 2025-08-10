import { cleanup } from "@solidjs/testing-library";
import { beforeEach } from "vitest";

beforeEach(() => {
	if ("document" in globalThis) {
		// In Vitest browser, cleanup must be in 'beforeEach' to clear the DOM from the previous test,
		// allowing the current test's DOM state to persist for visual inspection.
		cleanup();
	}
});

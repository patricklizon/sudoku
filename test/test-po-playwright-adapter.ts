import type { Locator, Page } from "playwright/test";
import type { PageObjectTestAdapter } from "./test-adapter-interface";

export class PlaywrightAdapter implements PageObjectTestAdapter<Locator> {
	constructor(private screen: Page) {}

	getByTestId<L extends Locator>(testId: string, container?: L | null): Locator {
		const scope = container ?? this.screen;
		return scope.getByTestId(testId);
	}
}

import type { Locator, Page } from "playwright/test";
import type { PageObjectTestAdapter } from "./test-adapter-interface";

export class PlaywrightAdapter implements PageObjectTestAdapter<Locator> {
	constructor(private screen: Page) {}

	getByTestId<L extends Locator>(testId: string, container?: Option<L>): Locator {
		const scope = container ?? this.screen;
		return scope.getByTestId(testId);
	}

	getNthByTestId<L extends Locator>(testId: string, index: number, container?: Option<L>): Locator {
		const scope = container ?? this.screen;
		return scope.getByTestId(testId).nth(index);
	}
}

import type { Locator, BrowserPage } from "@vitest/browser/context";
import type { PageObjectTestAdapter } from "./test-adapter-interface";

export class VitestBrowserAdapter implements PageObjectTestAdapter<Locator> {
	constructor(private screen: BrowserPage) {}

	getByTestId<L extends Locator>(testId: string, container?: Option<L>): Locator {
		const scope = container ?? this.screen;
		return scope.getByTestId(testId);
	}

	getNthByTestId<L extends Locator>(testId: string, index: number, container?: Option<L>): Locator {
		const scope = container ?? this.screen;
		return scope.getByTestId(testId).nth(index);
	}
}

import { BasePageObject, type BasePageObjectOptionList } from "#test/base-page-object";
import type { PageObjectTestAdapter } from "#test/test-adapter-interface";
import { ButtonTestId } from "./button.testid";

/**
 * Represents the Button component in the Page Object Model.
 * This class uses a TestAdapter to interact with the button element, making it reusable across different testing environments (unit, E2E).
 * It provides methods to get button properties and perform actions.
 * Assertions are left to the test file.
 */
export class ButtonPO<T> extends BasePageObject<T> {
	constructor(
		adapter: PageObjectTestAdapter<T>,
		optionList?: Partial<BasePageObjectOptionList<T>>,
	) {
		super(adapter, optionList?.testId ?? ButtonTestId.root, optionList);
	}

	getButton<E = T>(): E {
		return this.root() as E;
	}
}

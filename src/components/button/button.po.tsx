import { BasePageObject, type BasePageObjectOptionList } from "#test/base-page-object";
import type { PageObjectTestAdapter } from "#test/test-adapter-interface";
import { ButtonTestId } from "./button.testid";

export class ButtonPO<T> extends BasePageObject<T> {
	constructor(
		adapter: PageObjectTestAdapter<T>,
		optionList?: Partial<BasePageObjectOptionList<T>>,
	) {
		super(adapter, { ...optionList, testId: optionList?.testId ?? ButtonTestId.root });
	}

	getButton<E = T>(): E {
		return this.root() as E;
	}
}

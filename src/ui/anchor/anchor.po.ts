import { BasePageObject, type BasePageObjectOptionList } from "#test/base-page-object";
import type { PageObjectTestAdapter } from "#test/test-adapter-interface";
import { AnchorTestId } from "./anchor.testid";

export class AnchorPO<T> extends BasePageObject<T> {
	constructor(
		adapter: PageObjectTestAdapter<T>,
		optionList?: Partial<BasePageObjectOptionList<T>>,
	) {
		super(adapter, { ...optionList, testId: optionList?.testId ?? AnchorTestId.root });
	}
}

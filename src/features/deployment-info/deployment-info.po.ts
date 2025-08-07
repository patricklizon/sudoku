import { BasePageObject, type BasePageObjectOptionList } from "#test/base-page-object";
import type { PageObjectTestAdapter } from "#test/test-adapter-interface";
import { DeploymentInfoTestId } from "./deployment-info.testid";

export class DeploymentInfoPO<T> extends BasePageObject<T> {
	constructor(
		adapter: PageObjectTestAdapter<T>,
		optionList?: Partial<BasePageObjectOptionList<T>>,
	) {
		super(adapter, { ...optionList, testId: optionList?.testId ?? DeploymentInfoTestId.root });
	}

	getEntryAtIdx(idx: number): DeploymentInfoEntryPO<T> {
		return this.within(DeploymentInfoEntryPO, { atIdx: idx });
	}
}

class DeploymentInfoEntryPO<T> extends BasePageObject<T> {
	constructor(
		adapter: PageObjectTestAdapter<T>,
		optionList?: Partial<BasePageObjectOptionList<T>>,
	) {
		super(adapter, { ...optionList, testId: optionList?.testId ?? DeploymentInfoTestId.entry });
	}

	getLabel<E = T>(): E | null {
		return this.within(DeploymentInfoTestId.entryLabel);
	}

	getValue<E = T>(): E | null {
		return this.within(DeploymentInfoTestId.entryValue);
	}
}

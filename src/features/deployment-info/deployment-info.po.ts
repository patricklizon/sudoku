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

	getDeploymentIdEntry(): DeploymentInfoEntryPO<T> {
		return this.getEntryAtIdx(0);
	}

	getDeployedAtEntry(): DeploymentInfoEntryPO<T> {
		return this.getEntryAtIdx(1);
	}

	getPullRequestUrlEntry(): DeploymentInfoEntryPO<T> {
		return this.getEntryAtIdx(2);
	}
}

class DeploymentInfoEntryPO<T> extends BasePageObject<T> {
	constructor(
		adapter: PageObjectTestAdapter<T>,
		optionList?: Partial<BasePageObjectOptionList<T>>,
	) {
		super(adapter, { ...optionList, testId: optionList?.testId ?? DeploymentInfoTestId.entry });
	}

	getLabel<E = T>(): E {
		return this.within(DeploymentInfoTestId.entryLabel);
	}

	getValue<E = T>(): E {
		return this.within(DeploymentInfoTestId.entryValue);
	}
}

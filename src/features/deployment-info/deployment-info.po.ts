import { BasePageObject, type BasePageObjectOptionList } from "#test/base-page-object";
import type { PageObjectTestAdapter } from "#test/test-adapter-interface";
import { DeploymentInfoTestId } from "./deployment-info.testid";

/**
 * Represents the DeploymentInfo component in the Page Object Model.
 * This class uses a TestAdapter to interact with the deployment info element, making it reusable across different testing environments (unit, E2E).
 * It provides methods to get deployment info properties and perform actions.
 * Assertions are left to the test file.
 */
export class DeploymentInfoPO<T> extends BasePageObject<T> {
	constructor(
		adapter: PageObjectTestAdapter<T>,
		optionList?: Partial<BasePageObjectOptionList<T>>,
	) {
		super(adapter, { ...optionList, testId: optionList?.testId ?? DeploymentInfoTestId.root });
	}

	getDeploymentInfo<E = T>(): E {
		return this.root() as E;
	}

	getEntryAtIdx(idx: number): DeploymentInfoEntryPO<T> {
		return this.within(DeploymentInfoEntryPO, { atIdx: idx });
	}
}

/**
 * Represents a single entry in the DeploymentInfo component.
 * This class provides methods to interact with entry labels and values.
 */
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

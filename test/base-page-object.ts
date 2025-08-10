import { isDefined } from "#lib/utils/is-defined";
import { isNil } from "#lib/utils/is-nil";
import type { PageObjectTestAdapter } from "./test-adapter-interface";

/**
 * Options for creating or locating a Page Object (PO).
 */
export type BasePageObjectOptionList<T> = Partial<{
	parent: Option<T>;
	testId?: Option<string>;
	atIdx?: Option<number>;
}>;

/**
 * BasePageObject is the foundation for all Page Objects.
 *
 * It encapsulates UI interactions, providing utilities to locate its root element
 * and find elements or other Page Objects within that root.
 *
 * @template T The type of the root HTML element this PO represents (e.g., `HTMLDivElement`).
 */
export class BasePageObject<T> {
	/**
	 * Creates a BasePageObject instance.
	 * @param adapter The test adapter (e.g., Playwright's `Page`, Cypress's `cy`).
	 * @param optionList Optional configuration for this PO instance.
	 */
	constructor(
		private adapter: PageObjectTestAdapter<T>,
		private optionList?: BasePageObjectOptionList<T>,
	) {
		if (isNil(this.optionList?.testId)) throw new Error("test id is not defined");
		this.testId = this.optionList.testId;
	}

	private testId: string;

	/**
	 * Finds and returns the root element of this Page Object.
	 * This method does not throw an error if the element is not found.
	 * @returns The root element.
	 */
	root(): T {
		return isDefined(this.optionList?.atIdx)
			? this.adapter.getNthByTestId(this.testId, this.optionList.atIdx, this.optionList.parent)
			: this.adapter.getByTestId(this.testId, this.optionList?.parent);
	}

	within<TElement>(testIdOrPageObject: string, opts?: never): TElement;

	within<TElement, TPO extends BasePageObject<TElement>>(
		testIdOrPageObject: new (
			adapter: PageObjectTestAdapter<T>,
			opts?: BasePageObjectOptionList<T>,
		) => TPO,
		opts?: { testId?: string; atIdx?: number },
	): TPO;

	/**
	 * Finds an element or a child Page Object within this PO's root.
	 *
	 * @template TElement The expected HTML element type or child PO's root element type.
	 * @template TPageObject The constructor type of the child Page Object.
	 * @param TestIdOrPageObject A `data-testid` string or a child PO constructor.
	 * @param opts Optional additional options.
	 * @returns The found element or child PO instance.
	 * @throws {Error} If this PO's root element cannot be found.
	 */
	within<TPageObject extends BasePageObject<T>>(
		TestIdOrPageObject:
			| string
			| (new (
					adapter: PageObjectTestAdapter<T>,
					opts?: BasePageObjectOptionList<T>,
			  ) => TPageObject),
		opts?: { testId?: string; atIdx?: number },
	): T | TPageObject {
		const self = this.root();

		if (typeof TestIdOrPageObject === "string") {
			return isDefined(opts?.atIdx)
				? this.adapter.getNthByTestId(TestIdOrPageObject, opts.atIdx, self)
				: this.adapter.getByTestId(TestIdOrPageObject, self);
		}

		return new TestIdOrPageObject(
			this.adapter,

			isDefined(opts?.testId)
				? { parent: self, testId: opts.testId, atIdx: opts.atIdx }
				: { parent: self, atIdx: opts?.atIdx },
		);
	}
}

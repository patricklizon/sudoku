/**
 * Defines the interface for an adapter that can query elements in a testing environment.
 * This allows the Page Object to be environment-agnostic.
 */
export interface PageObjectTestAdapter<T> {
	/**
	 * Queries the DOM for an element matching the given data-testid.
	 * @param testId The value of the data-testid attribute.
	 * @returns The found element, or null if not found.
	 */
	getByTestId<K extends T = T>(testId: string, container?: Option<K>): T;

	/**
	 * Queries the DOM for the nth element matching the given data-testid.
	 * @param testId The value of the data-testid attribute.
	 * @param index The index of the element to select (0-based).
	 * @param container Optional container to scope the search.
	 * @returns The found element, or null if not found.
	 */
	getNthByTestId<K extends T = T>(testId: string, index: number, container?: Option<K>): T;
}

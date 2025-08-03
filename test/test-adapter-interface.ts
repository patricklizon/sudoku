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
	getByTestId<K extends T = T>(testId: string, container?: K | null): T | null;
}

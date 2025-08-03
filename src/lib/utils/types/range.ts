/**
 * Represents a range with lower and upper bounds.
 */
export type Range<T, Lower extends Option<T> = T, Upper extends Option<T> = T> = [
	lower: Lower,
	upper: Upper,
];

/**
 * A flexible range type that supports various combinations of defined and optional bounds.
 */
export type RangeFlexible<T> =
	| Range<T, Option<T>, T>
	| Range<T>
	| Range<T, T, Option<T>>
	| Range<Option<T>>;

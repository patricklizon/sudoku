import type { Option } from './option';

export type Range<T, L extends Option<T> = T, U extends Option<T> = T> = [lower: L, upper: U];

export type RangeFlexible<T> =
	| Range<T, Option<T>, T>
	| Range<T>
	| Range<T, T, Option<T>>
	| Range<Option<T>>;

/**
 * Converts `readonly` types to mutable.
 */
type Mutable<T> = {
	-readonly [P in keyof T]: T[P];
};

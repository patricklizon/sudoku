export type RecordKey = string | number | symbol;

/**
 * Creates a type containing all keys from type A that are not present in type B.
 *
 * @param A - The source record type
 * @param B - The record type whose keys will be excluded from A
 *
 * @example
 * ```ts
 * type User = { id: number; name: string; age: number };
 * type UserPartial = { id: number; name: string };
 *
 * // Result: { age: number }
 * type MissingProps = RecordDifference<User, UserPartial>;
 * ```
 */
export type RecordDifference<
	R extends Record<RecordKey, unknown>,
	ExcludeKeysFrom extends Record<RecordKey, unknown>,
> = { [K in Exclude<keyof R, keyof ExcludeKeysFrom>]: R[K] };

/**
 * Makes all properties of record mutable.
 *
 * @example
 * ```typescript
 * type ReadonlyPerson = {
 *   readonly name: string;
 *   readonly age: number;
 * };
 *
 * type MutablePerson = Mutable<ReadonlyPerson>;
 * // Equivalent to: { name: string; age: number; }
 * ```
 */
export type RecordMutable<T extends Record<RecordKey, unknown>> = {
	-readonly [P in keyof T]: T[P];
};

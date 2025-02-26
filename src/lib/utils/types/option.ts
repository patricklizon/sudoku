/**
 * Represents empty value.
 */
export type Nil = null | undefined;

/**
 * Represents a value that may be of type `T` or may be `null` or `undefined`.
 */
export type Option<T> = T | Nil;

/**
 * Represents empty value.
 */
type Nil = null | undefined;

/**
 * Represents a value that may be of type `T` or may be `null` or `undefined`.
 */
type Option<T> = T | Nil;

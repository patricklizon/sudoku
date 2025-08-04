/**
 * Represents an opaque type that wraps a base type with a unique brand.
 *
 * Opaque types allow for nominal typing in TypeScript's structural type system
 * by attaching a phantom type parameter `Brand` to a base type `T`.
 *
 * @param Brand - A string literal type that serves as a unique identifier for this type
 * @param T - The underlying type being wrapped (limited to string or number)
 *
 * @example
 * ```typescript
 * type UserId = Opaque<'UserId', string>;
 * type PostId = Opaque<'PostId', string>;
 *
 * // These are now distinct types despite both being strings underneath
 * const userId: UserId = 'user-123' as UserId;
 * const postId: PostId = 'post-456' as PostId;
 *
 * // This will cause a type error:
 * const incorrectAssignment: UserId = postId;
 * ```
 */
type Opaque<Brand extends string, T extends string | number> = T & {
	readonly __brand: Brand;
};

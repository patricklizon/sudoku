import { isNil } from "./is-nil";
import type { Primitive } from "./types/primitive";

export function isEmpty<T extends { length: number } | { size: number } | Nil | Primitive>(
	it: T,
): it is NonNullable<T> {
	if (isNil(it)) return true;
	if (typeof it === "string" || Array.isArray(it)) return it.length === 0;
	if (it instanceof Set || it instanceof Map) return it.size === 0;

	return false;
}

import { isNil } from "./is-nil";

export function isEmpty(it: { length: number } | { size: number } | Nil | Primitive): boolean {
	if (isNil(it)) return true;
	if (typeof it === "string" || Array.isArray(it)) return it.length === 0;
	if (it instanceof Set || it instanceof Map) return it.size === 0;

	return false;
}

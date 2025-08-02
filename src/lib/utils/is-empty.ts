import { isNil } from "./is-nil";
import { isNumber } from "./is-number";
import type { Nil } from "./types/option";

export function isEmpty(it: { length: number } | { size: number } | Nil): boolean {
	if (isNil(it)) return true;
	if (typeof it === "object") {
		if ("length" in it && isNumber(it.length)) {
			return it.length === 0;
		}
		if ("size" in it && isNumber(it.size)) {
			return it.size === 0;
		}

		throw new TypeError(`Unsupported value passed to isEmpty: ${it as unknown as string}`);
	}

	return true;
}

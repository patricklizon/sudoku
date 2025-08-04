import { isNil } from "./is-nil";

export function isDefined<T>(it: Option<T>): it is T {
	return !isNil(it);
}

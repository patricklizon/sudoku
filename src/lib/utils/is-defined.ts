export function isDefined<T>(it: Option<T>): it is T {
	return it !== undefined && it !== null;
}

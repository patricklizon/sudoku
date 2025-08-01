export function isEmpty(it: { length: number } | { size: number }): boolean {
	return "length" in it ? it.length === 0 : it.size === 0;
}

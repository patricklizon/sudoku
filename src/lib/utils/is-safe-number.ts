export function isSafeNumber(it: Option<unknown>): it is number {
	if (Number.isNaN(it) || !Number.isFinite(it)) return false;
	return typeof it === "number";
}

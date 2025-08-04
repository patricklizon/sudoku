export function isSafeNumber(it: unknown): it is number {
	if (Number.isNaN(it) || !Number.isFinite(it)) return false;
	return typeof it === "number";
}

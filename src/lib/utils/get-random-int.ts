/**
 * Returns digit within valid range.
 */
export function getRandomInt(maxNumber: number): number {
	// TODO: add salt
	return Math.floor(Math.random() * maxNumber);
}

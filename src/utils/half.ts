/**
 * Utility function to get half of a number.
 * Used in edge cases like exclusive minimums/maximums in numeric validators.
 */
export function half(value: number): number {
	return value / 2;
}

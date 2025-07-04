/**
 * Utility function to omit specific keys from an object
 */
export function omit<T extends Record<string, any>, K extends keyof T>(
	obj: T,
	keys: K[]
): Omit<T, K> {
	const result = { ...obj };
	for (const key of keys) {
		delete result[key];
	}
	return result;
}

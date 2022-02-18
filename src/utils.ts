export function isNumber(testValue: unknown): testValue is number {
	return typeof testValue == 'number' && !isNaN(testValue);
}

export function isNumber(testValue: unknown): testValue is number {
	return typeof testValue == 'number' && !isNaN(testValue);
}

export function buildNoopEnv() {
	/**
	 * Noop object that can chain function invocations without throwing an exception.
	 */
	const noop: any = new Proxy(
		{},
		{
			apply(_, thisArg) {
				return () => thisArg;
			},
			get(_, __, receiver) {
				// if (prop === known intermediates here) {
				// 	return receiver;
				// }
				return () => receiver;
			}
		}
	);

	return noop as unknown as Window;
}

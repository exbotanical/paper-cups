import { buildNoopEnv, isNumber } from '../src/utils';

describe('utils', () => {
	describe('isNumber', () => {
		it('returns false given non-number data types', () => {
			const types = ['str', {}, [1], null, undefined, new Map(), new Set()];

			types.forEach((type) => {
				expect(isNumber(type)).toBe(false);
			});
		});

		it('returns false given NaN', () => {
			expect(isNumber(NaN)).toBe(false);
		});

		it('returns true given a number', () => {
			expect(isNumber(9)).toBe(true);
		});
	});

	describe('buildNoopEnv', () => {
		const env = buildNoopEnv();
		it('does not throw an error when invoking any method on the object', () => {
			expect(() => {
				env.addEventListener('', () => {});
				env.removeEventListener('', () => {});
				env.postMessage('');
			}).not.toThrow();
		});

		it('does not throw when accessing any property on the object', () => {
			expect(() => {
				// @ts-expect-error
				env.random;
			}).not.toThrow();
		});

		it('returns the instance from method invocations', () => {
			expect(() => {
				// eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
				env
					.addEventListener('', () => {})
					// @ts-expect-error
					.removeEventListener('', () => {})
					.postMessage('');
			}).not.toThrow();
		});
	});
});

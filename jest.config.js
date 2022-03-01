module.exports = {
	collectCoverage: true,
	collectCoverageFrom: ['src/**/*.ts'],
	coverageDirectory: './coverage',
	coverageThreshold: {
		global: {
			branches: 75,
			functions: 75,
			lines: 75,
			statements: 75
		}
	},
	errorOnDeprecated: true,
	setupFilesAfterEnv: ['<rootDir>/__tests__/setup.ts'],
	testEnvironment: 'jsdom',
	testRegex: '.test.ts$',
	timers: 'fake',
	verbose: true
};

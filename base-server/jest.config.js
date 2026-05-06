module.exports = {
	preset: "ts-jest",
	testEnvironment: "node",
	roots: ["<rootDir>/src", "<rootDir>/tests"],
	testMatch: ["**/__tests__/**/*.ts", "**/?(*.)+(spec|test).ts"],
	transform: {
		"^.+\\.ts$": [
			"ts-jest",
			{
				tsconfig: {
					esModuleInterop: true,
				},
			},
		],
	},
	transformIgnorePatterns: ["node_modules/(?!@faker-js)"],
	collectCoverageFrom: [
		"src/**/*.ts",
		"!src/**/*.d.ts",
		"!src/**/*.interface.ts",
		"!src/**/*.type.ts",
		"!src/server.ts",
	],
	coverageDirectory: "coverage",
	coverageReporters: ["text", "lcov", "html"],
	moduleNameMapper: {
		"^@/(.*)$": "<rootDir>/src/$1",
		"^i18next$": "<rootDir>/__mocks__/i18next.js",
	},
	setupFiles: ["<rootDir>/tests/setup-env.js"],
	setupFilesAfterEnv: ["<rootDir>/tests/setup.ts"],
	testTimeout: 30000,
	verbose: true,
	clearMocks: true,
	resetMocks: true,
	restoreMocks: true,
};

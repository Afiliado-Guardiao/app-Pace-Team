module.exports = {
	preset: "jest-expo",
	transformIgnorePatterns: [
		"node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@sentry/.*|native-base|react-native-svg)",
	],
	moduleNameMapper: {
		"^@/(.*)$": "<rootDir>/src/$1",
		// O Lucide publica ESM (.mjs) para React Native; nos testes usamos o build CommonJS
		"^lucide-react-native/icons$":
			"<rootDir>/node_modules/lucide-react-native/dist/cjs/icons/index.js",
		"^lucide-react-native$":
			"<rootDir>/node_modules/lucide-react-native/dist/cjs/lucide-react-native.js",
	},
	collectCoverageFrom: [
		"src/**/*.{ts,tsx}",
		"!src/**/*.d.ts",
		"!src/**/__tests__/**",
		"!src/**/types/**",
		"!src/**/constants/**",
		"!src/**/styles/**",
	],
	// reference/ guarda as telas do template substituídas pelo PACE TEAM
	testPathIgnorePatterns: ["/node_modules/", "/reference/"],
	testMatch: ["**/__tests__/**/*.test.(ts|tsx)"],
	setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
};

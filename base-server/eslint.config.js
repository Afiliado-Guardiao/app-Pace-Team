const eslint = require("@eslint/js");
const tseslint = require("typescript-eslint");
const prettierConfig = require("eslint-config-prettier");
const simpleImportSortPlugin = require("eslint-plugin-simple-import-sort");
const unusedImportsPlugin = require("eslint-plugin-unused-imports");

module.exports = tseslint.config(
	// Base configs
	eslint.configs.recommended,
	...tseslint.configs.strictTypeChecked,
	prettierConfig,

	// Ignores
	{
		ignores: [
			"node_modules/",
			"dist/",
			"coverage/",
			"docker/",
			".claude/",
			"build/",
			"reference/",
			"test/",
			"tests/",
			"__mocks__/",
			"*.config.js",
			"*.config.ts",
			"babel.config.js",
			"jest.config.js",
			"tsup.config.ts",
		],
	},

	// Main configuration
	{
		files: ["**/*.{ts,tsx,js,jsx}"],
		languageOptions: {
			parser: tseslint.parser,
			parserOptions: {
				ecmaVersion: 2022,
				sourceType: "module",
				projectService: true,
				tsconfigRootDir: __dirname,
			},
		},
		plugins: {
			"@typescript-eslint": tseslint.plugin,
			"simple-import-sort": simpleImportSortPlugin,
			"unused-imports": unusedImportsPlugin,
		},
		rules: {
			// TypeScript - Regras estritas mantidas do projeto original
			"@typescript-eslint/no-explicit-any": "error",
			"@typescript-eslint/no-unsafe-assignment": "error",
			"@typescript-eslint/no-unsafe-member-access": "error",
			"@typescript-eslint/no-unsafe-call": "error",
			"@typescript-eslint/no-unsafe-return": "error",
			"@typescript-eslint/no-unsafe-argument": "error",
			"@typescript-eslint/explicit-function-return-type": "warn",
			"@typescript-eslint/explicit-module-boundary-types": "warn",
			"@typescript-eslint/no-unused-vars": "off", // Desligado - unused-imports cuida disso

			// Import Sorting - Organização automática de imports
			"simple-import-sort/imports": [
				"error",
				{
					groups: [
						// Side effects (imports sem atribuição)
						["^\\u0000"],

						// Node built-ins
						["^node:"],

						// External packages
						["^@?\\w"],

						// Internal aliases - adaptado para estrutura backend
						["^@/core", "^@/domain", "^@/infrastructure", "^@/shared", "^@/"],

						// Parent imports (..)
						["^\\.\\."],

						// Sibling imports (.)
						["^\\."],

						// Style imports (se houver)
						["\\.styles$", "\\.css$"],
					],
				},
			],
			"simple-import-sort/exports": "error",

			// Unused Imports - Remoção automática
			"unused-imports/no-unused-imports": "error",
			"unused-imports/no-unused-vars": [
				"warn",
				{
					vars: "all",
					varsIgnorePattern: "^_",
					args: "after-used",
					argsIgnorePattern: "^_",
				},
			],

			// General - Boas práticas
			"sort-imports": "off", // Desligado - simple-import-sort cuida
			"import/order": "off", // Desligado - simple-import-sort cuida
			"no-console": ["warn", { allow: ["warn", "error"] }],
			"prefer-const": "error",
			"no-var": "error",
			quotes: ["error", "double", { avoidEscape: true }],
		},
	},
);

const eslint = require("@eslint/js");
const tseslint = require("typescript-eslint");
const prettierConfig = require("eslint-config-prettier");
const simpleImportSortPlugin = require("eslint-plugin-simple-import-sort");
const unusedImportsPlugin = require("eslint-plugin-unused-imports");
const reactPlugin = require("eslint-plugin-react");
const reactHooksPlugin = require("eslint-plugin-react-hooks");
const reactNativePlugin = require("eslint-plugin-react-native");

module.exports = tseslint.config(
	eslint.configs.recommended,
	...tseslint.configs.strictTypeChecked,
	reactPlugin.configs.flat.recommended,
	reactPlugin.configs.flat["jsx-runtime"],
	prettierConfig,

	{
		ignores: [
			"node_modules/",
			"dist/",
			"build/",
			"coverage/",
			".expo/",
			"android/",
			"ios/",
			"web-build/",
			".claude/",
			"eslintref/",
			"reference/",
			"**/__tests__/**",
			"*.config.js",
			"*.config.ts",
			"babel.config.js",
			"metro.config.js",
			"jest.setup.js",
		],
	},

	{
		files: ["**/*.{ts,tsx,js,jsx}"],
		languageOptions: {
			parser: tseslint.parser,
			parserOptions: {
				ecmaVersion: 2022,
				sourceType: "module",
				projectService: true,
				tsconfigRootDir: __dirname,
				ecmaFeatures: {
					jsx: true,
				},
			},
		},
		plugins: {
			"@typescript-eslint": tseslint.plugin,
			"simple-import-sort": simpleImportSortPlugin,
			"unused-imports": unusedImportsPlugin,
			react: reactPlugin,
			"react-hooks": reactHooksPlugin,
			"react-native": reactNativePlugin,
		},
		settings: {
			react: {
				version: "detect",
			},
		},
		rules: {
			"@typescript-eslint/no-explicit-any": "error",
			"@typescript-eslint/no-unsafe-assignment": "off",
			"@typescript-eslint/no-unsafe-member-access": "error",
			"@typescript-eslint/no-unsafe-call": "error",
			"@typescript-eslint/no-unsafe-return": "error",
			"@typescript-eslint/no-unsafe-argument": "error",
			"@typescript-eslint/explicit-function-return-type": "off",
			"@typescript-eslint/explicit-module-boundary-types": "off",
			"@typescript-eslint/no-unused-vars": "off",

			"simple-import-sort/imports": [
				"error",
				{
					groups: [
						["^\\u0000"],

						["^react$", "^react-native$"],

						["^expo", "^@expo"],

						["^@?\\w"],

						[
							"^@/components",
							"^@/features",
							"^@/theme",
							"^@/lib",
							"^@/store",
							"^@/i18n",
							"^@/types",
							"^@/",
						],

						["^\\.\\."],

						["^\\."],

						["\\.styles$", "\\.css$"],
					],
				},
			],
			"simple-import-sort/exports": "error",

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

			"react/react-in-jsx-scope": "off",
			"react/prop-types": "off",
			"react-hooks/rules-of-hooks": "error",
			"react-hooks/exhaustive-deps": "warn",
			"react-native/no-unused-styles": "error",
			"react-native/no-inline-styles": "warn",
			"react-native/no-color-literals": "off",
			"react-native/no-raw-text": "off",

			"sort-imports": "off",
			"import/order": "off",
			"no-console": ["warn", { allow: ["warn", "error"] }],
			"no-empty": ["error", { allowEmptyCatch: true }],
			"prefer-const": "error",
			"no-var": "error",
			quotes: ["error", "double", { avoidEscape: true }],
		},
	},

	// Override rules for third-party SDK services
	{
		files: ["src/lib/services/**/*.ts"],
		rules: {
			"@typescript-eslint/no-unsafe-assignment": "off",
			"@typescript-eslint/no-unsafe-member-access": "off",
			"@typescript-eslint/no-unsafe-call": "off",
			"@typescript-eslint/no-unnecessary-condition": "off",
			"@typescript-eslint/require-await": "warn",
			"no-async-promise-executor": "warn",
		},
	},
);

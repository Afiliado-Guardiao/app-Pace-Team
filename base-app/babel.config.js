module.exports = function (api) {
	api.cache(true);
	return {
		presets: ["babel-preset-expo"],
		plugins: [
			[
				"module-resolver",
				{
					root: ["./"],
					alias: {
						"@": "./src",
						"@/components": "./src/components",
						"@/theme": "./src/theme",
						"@/features": "./src/features",
						"@/lib": "./src/lib",
						"@/store": "./src/store",
						"@/i18n": "./src/i18n",
						"@/types": "./src/types",
					},
				},
			],
		],
	};
};

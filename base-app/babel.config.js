module.exports = function (api) {
	api.cache(true);
	return {
		// import.meta (devtools do zustand) quebra o bundle web sem esta transformação
		presets: [["babel-preset-expo", { unstable_transformImportMeta: true }]],
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

const path = require("path");

const { getDefaultConfig } = require("expo/metro-config");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// O build ESM do supabase-js (2.106+) tem um `import()` dinâmico do OpenTelemetry
// que o Hermes não compila no build de release ("Invalid expression encountered").
// O build CommonJS faz o mesmo com `require`, que o Metro aceita.
const SUPABASE_CJS = path.join(__dirname, "node_modules/@supabase/supabase-js/dist/index.cjs");

config.resolver.resolveRequest = (context, moduleName, platform) => {
	if (moduleName === "@supabase/supabase-js") {
		return { type: "sourceFile", filePath: SUPABASE_CJS };
	}
	return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;

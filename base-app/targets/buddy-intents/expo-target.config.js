// Cartão do Pace Buddy (Toque Traseiro › "Chamar Pace Buddy") numa extensão
// própria: o iPhone mostra o cartão sem abrir o app inteiro (abre na hora).
// O Buddy, a fala, o estado e as intents da corrida são os mesmos do widget:
// os arquivos de ../buddy-widget/_shared são copiados para ./shared a cada
// prebuild (a cópia não vai para o git). A corrida em si continua rodando no
// app (o iOS roda as LiveActivityIntent lá).
const fs = require("fs");
const path = require("path");

const SHARED = path.join(__dirname, "..", "buddy-widget", "_shared");
const COPY = path.join(__dirname, "shared");

fs.rmSync(COPY, { recursive: true, force: true });
fs.mkdirSync(COPY, { recursive: true });
for (const file of fs.readdirSync(SHARED)) {
	if (file.endsWith(".swift")) fs.copyFileSync(path.join(SHARED, file), path.join(COPY, file));
}

/** @type {import('@bacons/apple-targets/app.plugin').ConfigFunction} */
module.exports = (config) => ({
	type: "app-intent",
	name: "PaceBuddyIntents",
	displayName: "Pace Buddy",
	bundleIdentifier: ".intents",
	deploymentTarget: "26.0",
	frameworks: ["SwiftUI", "WidgetKit", "ActivityKit", "AppIntents", "CoreLocation"],
	entitlements: {
		"com.apple.security.application-groups":
			config.ios.entitlements["com.apple.security.application-groups"],
	},
});

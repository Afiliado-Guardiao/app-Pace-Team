// Widget do Pace Buddy na tela inicial + corrida na Dynamic Island (Live
// Activity) + tela do despertador. Os arquivos em _shared também entram no
// app principal (o atalho e a corrida rodam lá).
/** @type {import('@bacons/apple-targets/app.plugin').ConfigFunction} */
module.exports = (config) => ({
	type: "widget",
	name: "PaceBuddyWidget",
	displayName: "Pace Buddy",
	deploymentTarget: "17.0",
	frameworks: ["SwiftUI", "WidgetKit", "ActivityKit", "AppIntents", "CoreLocation"],
	colors: {
		$accent: "#FD5A0C",
		$widgetBackground: "#1B2733",
	},
	images: {
		paceLogo: "../../assets/brand/logo-horizontal.png",
	},
	entitlements: {
		"com.apple.security.application-groups":
			config.ios.entitlements["com.apple.security.application-groups"],
	},
});

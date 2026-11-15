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
		$widgetBackground: "#0B0B0B",
	},
	images: {
		paceLogo: "../../assets/brand/logo-horizontal.png",
		// Novo Bud (camadas) e itens 3D do Buddy Studio (mesmas imagens do app)
		bud_body: "../../assets/bud/body.png",
		bud_hand_l: "../../assets/bud/handL.png",
		bud_hand_r: "../../assets/bud/handR.png",
		bud_hand_l_full: "../../assets/bud/handLFull.png",
		bud_hand_r_full: "../../assets/bud/handRFull.png",
		studio_astronauta: "../../assets/studio/astronauta.png",
		studio_espadas: "../../assets/studio/espadas.png",
		studio_espelhado: "../../assets/studio/espelhado.png",
		studio_faixa_ninja: "../../assets/studio/faixa-ninja.png",
		studio_fone: "../../assets/studio/fone.png",
		studio_gato: "../../assets/studio/gato.png",
		studio_hyottoko: "../../assets/studio/hyottoko.png",
		studio_kitsune: "../../assets/studio/kitsune.png",
		studio_mago: "../../assets/studio/mago.png",
		studio_narigao: "../../assets/studio/narigao.png",
		studio_ondas: "../../assets/studio/ondas.png",
		studio_oni: "../../assets/studio/oni.png",
		studio_palha: "../../assets/studio/palha.png",
		studio_paraquedas: "../../assets/studio/paraquedas.png",
		studio_robo: "../../assets/studio/robo.png",
		studio_samurai: "../../assets/studio/samurai.png",
		studio_sorriso: "../../assets/studio/sorriso.png",
		studio_tribal: "../../assets/studio/tribal.png",
		studio_vampiro: "../../assets/studio/vampiro.png",
		studio_viking: "../../assets/studio/viking.png",
	},
	entitlements: {
		"com.apple.security.application-groups":
			config.ios.entitlements["com.apple.security.application-groups"],
	},
});

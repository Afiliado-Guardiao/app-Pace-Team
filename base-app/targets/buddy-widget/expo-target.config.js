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
		// Novo Bud (camadas) e itens 3D do Buddy Studio: as mesmas imagens do app,
		// em 200 px (assets/widget). Grandes, o iPhone passa do limite de imagem
		// da tela de bloqueio e da Dynamic Island e troca o Bud por um quadrado
		// cinza (aconteceu com a máscara do Studio)
		bud_body: "../../assets/widget/bud-body.png",
		bud_hand_l: "../../assets/widget/bud-handL.png",
		bud_hand_r: "../../assets/widget/bud-handR.png",
		bud_hand_l_full: "../../assets/widget/bud-handLFull.png",
		bud_hand_r_full: "../../assets/widget/bud-handRFull.png",
		// Bud preto: arte própria (luz e sombra no escuro)
		bud_body_dark: "../../assets/widget/bud-bodyDark.png",
		bud_hand_l_dark: "../../assets/widget/bud-handLDark.png",
		bud_hand_r_dark: "../../assets/widget/bud-handRDark.png",
		bud_hand_l_full_dark: "../../assets/widget/bud-handLFullDark.png",
		bud_hand_r_full_dark: "../../assets/widget/bud-handRFullDark.png",
		studio_astronauta: "../../assets/widget/studio-astronauta.png",
		studio_espadas: "../../assets/widget/studio-espadas.png",
		studio_espelhado: "../../assets/widget/studio-espelhado.png",
		studio_faixa_ninja: "../../assets/widget/studio-faixa-ninja.png",
		studio_fone: "../../assets/widget/studio-fone.png",
		studio_gato: "../../assets/widget/studio-gato.png",
		studio_hyottoko: "../../assets/widget/studio-hyottoko.png",
		studio_kitsune: "../../assets/widget/studio-kitsune.png",
		studio_mago: "../../assets/widget/studio-mago.png",
		studio_narigao: "../../assets/widget/studio-narigao.png",
		studio_ondas: "../../assets/widget/studio-ondas.png",
		studio_oni: "../../assets/widget/studio-oni.png",
		studio_palha: "../../assets/widget/studio-palha.png",
		studio_paraquedas: "../../assets/widget/studio-paraquedas.png",
		studio_robo: "../../assets/widget/studio-robo.png",
		studio_samurai: "../../assets/widget/studio-samurai.png",
		studio_sorriso: "../../assets/widget/studio-sorriso.png",
		studio_tribal: "../../assets/widget/studio-tribal.png",
		studio_vampiro: "../../assets/widget/studio-vampiro.png",
		studio_viking: "../../assets/widget/studio-viking.png",
	},
	entitlements: {
		"com.apple.security.application-groups":
			config.ios.entitlements["com.apple.security.application-groups"],
	},
});

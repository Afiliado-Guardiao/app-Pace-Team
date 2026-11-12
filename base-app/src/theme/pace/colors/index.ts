// PACE TEAM — cores do design system (tokens/colors.css), 1:1 com o Cloud Design.

const orange = {
	200: "#FFC29E",
	300: "#FF9A5C",
	400: "#FF7A2E",
	500: "#FD5A0C",
	600: "#E84A00",
	700: "#CD3600",
	800: "#8A2400",
} as const;

const navy = {
	950: "#0B0B0B",
	900: "#141414",
	850: "#191919",
	800: "#1B1B1B",
	700: "#232323",
	600: "#313131",
	500: "#454545",
	400: "#606060",
} as const;

const slate = {
	950: "#1D1D1D",
	900: "#252525",
	800: "#2F2F2F",
	700: "#3C3C3C",
	600: "#4F4F4F",
	500: "#676767",
	400: "#8B8B8B",
	300: "#B5B5B5",
} as const;

const graphite = {
	900: "#101010",
	800: "#1F1F1F",
	700: "#2D2D2D",
	500: "#666666",
	300: "#ACACAC",
} as const;

const ink = {
	white: "#FFFFFF",
	100: "#F6F6F6",
	200: "#E2E2E2",
} as const;

const semantic = {
	green: "#2FD08A",
	amber: "#FFB547",
	red: "#FF4D5E",
	blue: "#979797",
	gold: "#FFC94D",
	silver: "#D2D2D2",
	bronze: "#D9884E",
} as const;

export const paceColors = {
	orange,
	navy,
	slate,
	graphite,
	ink,
	semantic,

	// Fundos
	bgApp: "#050505",
	bgScreenBase: "#000000",
	bgPhotoDim: "rgba(0,0,0,.2)",
	bgVideo: "#141414",
	splashTrack: "rgba(255,255,255,.15)",
	dotIdle: "rgba(255,255,255,.3)",
	orbitRingOuter: "rgba(255,255,255,.035)",
	orbitRingInner: "rgba(255,255,255,.05)",
	bgElevated: "#151515",
	bgSunken: "#000000",

	// Acento (laranja da marca)
	accent: orange[500],
	accentHover: orange[400],
	accentPress: orange[600],
	accentSoft: "rgba(253,90,12,.16)",
	accentRing: "rgba(253,90,12,.45)",
	accentFocus: "rgba(253,90,12,.12)",
	onAccent: ink.white,

	// Texto
	textPrimary: "#FFFFFF",
	textSecondary: "rgba(255,255,255,.74)",
	textTertiary: "rgba(255,255,255,.54)",
	textDisabled: "rgba(255,255,255,.32)",
	textAccent: orange[400],
	textOnLight: navy[950],

	// Vidro (glassmorphism)
	glass1: "rgba(255,255,255,.10)",
	glass2: "rgba(255,255,255,.16)",
	glass3: "rgba(255,255,255,.24)",
	glassDark: "rgba(50,50,50,.50)",
	glassTintBlue: "rgba(139,139,139,.22)",
	glassBorder: "rgba(255,255,255,.16)",
	glassBorderStrong: "rgba(255,255,255,.45)",
	glassHighlight: "rgba(255,255,255,.45)",
	glassPanel: "rgba(55,55,55,.62)",
	glassToast: "rgba(55,55,55,.55)",
	glassTooltip: "rgba(55,55,55,.6)",
	glassLight: "rgba(255,255,255,.9)",
	hairline: "rgba(255,255,255,.14)",

	// Superfícies
	surfaceInput: "rgba(255,255,255,.10)",
	surfaceScrim: "rgba(29,29,29,.55)",
	surfaceTabIdle: "rgba(255,255,255,.14)",
	surfaceIconDot: "rgba(255,255,255,.08)",
	trackEmpty: "rgba(255,255,255,.1)",
	barIdle: "rgba(255,255,255,.16)",
	barSoft: "rgba(255,255,255,.12)",
	barEmpty: "rgba(255,255,255,.06)",
	barTrack: "rgba(255,255,255,.08)",
	barSoftFill: "rgba(255,255,255,.55)",
	tickEmpty: "rgba(255,255,255,.32)",
	sheetHandle: "rgba(255,255,255,.25)",
	avatarRing: "rgba(255,255,255,.55)",
	accentBorderSoft: "rgba(255,170,120,.5)",
	accentBorderYou: "rgba(255,170,120,.55)",
	accentBorderTab: "rgba(255,200,170,.55)",
	podiumFirstBorder: "rgba(253,90,12,.5)",
	selectOptionBg: slate[800],

	// Status (validação da corrida)
	statusSuccess: semantic.green,
	statusWarning: semantic.amber,
	statusDanger: semantic.red,
	statusInfo: semantic.blue,
	statusSuccessSoft: "rgba(47,208,138,.16)",
	statusWarningSoft: "rgba(255,181,71,.16)",
	statusDangerSoft: "rgba(255,77,94,.16)",
	statusInfoSoft: "rgba(151,151,151,.16)",

	// Pódio (só posições 1–3)
	rankGold: semantic.gold,
	rankSilver: semantic.silver,
	rankBronze: semantic.bronze,

	// Mapa
	route: orange[500],
	// Rastro de quem vai na frente na corrida em grupo (outra cor que a rota)
	leaderTrail: semantic.gold,
	// Percurso dos colegas que correram junto (o seu é o laranja)
	crewRoute: "rgba(255,255,255,.92)",
	crewRouteGlow: "rgba(255,255,255,.28)",

	// Tendência no ranking (feed)
	trendUp: "#2FD08A",
	trendDown: "#FF5A5A",
	// Arte do post (foto da corrida com marca PACE TEAM)
	postRoute: "#E8641E",
	postBadgeBg: "rgba(25,25,25,.88)",
	postBadgeBorder: "rgba(255,255,255,.12)",
	postBadgeSub: "#B9A78A",
	postDivider: "rgba(255,255,255,.18)",
	textShadow: "rgba(0,0,0,.45)",
	// Câmera do post
	cameraBg: "#000000",
	cameraBtnFill: "rgba(255,255,255,.14)",
	cameraBtnBorder: "rgba(255,255,255,.35)",
	cameraThumbBorder: "rgba(255,255,255,.3)",
	// Stories de compartilhar (arte 1080×1920)
	storyAccentText: "#FFB98A",
	storyPillBg: "rgba(21,21,21,.82)",
	storyPillBorder: "rgba(255,255,255,.25)",
	storyPillSub: "#C9B79A",
	storyDivider: "rgba(255,255,255,.2)",
	storyRouteSolid: "#FF8A4C",
	storyRouteGlow: "rgba(253,90,12,.9)",
	storyTextShadow: "rgba(0,0,0,.35)",
	storyMuted: "rgba(255,255,255,.75)",
	storyLabel: "rgba(255,255,255,.85)",
	storyBarTrack: "rgba(255,255,255,.22)",
	storyGold: "#F6C94C",
	storySilver: "#DBDBDB",
	storyBronze: "#E0915A",
	checkerA: "#444444",
	checkerB: "#545454",
	shareTabActive: "rgba(255,255,255,.2)",
	shareTabActiveBorder: "rgba(255,255,255,.55)",
	// Mapa: cartões de rota, nota de privacidade e pontos do carrossel
	routeCardOn: "rgba(255,255,255,.18)",
	routeCardOff: "rgba(255,255,255,.1)",
	routeCardBorderOn: "rgba(253,90,12,.6)",
	mapNoteBg: "rgba(55,55,55,.6)",
	pagerDotOff: "rgba(255,255,255,.35)",
	// Equipe: medalhas do pódio semanal, linhas de integrantes e vagas
	medalGoldGlow: "rgba(246,201,76,.75)",
	medalSilverGlow: "rgba(219,219,219,.6)",
	medalBronzeGlow: "rgba(224,145,90,.6)",
	medalGoldInk: "#5A3B00",
	medalSilverInk: "#383838",
	medalBronzeInk: "#4A2008",
	medalBorder: "rgba(255,255,255,.55)",
	podiumBarBorder: "rgba(255,255,255,.3)",
	podiumRing: "rgba(255,255,255,.7)",
	memberYouBorder: "rgba(253,90,12,.4)",
	segLiteBg: "rgba(255,255,255,.08)",
	slotEmpty: "rgba(255,255,255,.14)",
	slotDotEmpty: "rgba(255,255,255,.16)",
	whatsapp: "#1FAF5A",
	// Atividades: miniatura do percurso e nota de saúde dos desafios
	routeThumbBg: "rgba(11,11,11,.6)",
	healthNoteBg: "rgba(151,151,151,.1)",
	healthNoteBorder: "rgba(151,151,151,.25)",
	iconDotSoft: "rgba(255,255,255,.12)",
	iconDotBorder: "rgba(255,255,255,.3)",
	innerTile: "rgba(255,255,255,.10)",
	innerTileBorder: "rgba(255,255,255,.24)",
	stackDim: "rgba(0,0,0,.18)",
	dotIdleStrong: "rgba(255,255,255,.35)",
	feedBorder: "rgba(255,255,255,.28)",
	barRival: "rgba(255,255,255,.5)",
	barMember: "rgba(255,255,255,.55)",
	legendRival: "rgba(255,255,255,.6)",
	winSoft: "rgba(47,208,138,.18)",
	lossSoft: "rgba(255,77,94,.16)",

	transparent: "transparent",
} as const;

export type IPaceColors = typeof paceColors;

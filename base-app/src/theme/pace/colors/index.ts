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
	950: "#010D18",
	900: "#041727",
	850: "#071C2E",
	800: "#0A1E30",
	700: "#11263B",
	600: "#1B3550",
	500: "#2A4A68",
	400: "#3F6684",
} as const;

const slate = {
	950: "#141E28",
	900: "#1B2733",
	800: "#23313F",
	700: "#2D3E4F",
	600: "#3B5266",
	500: "#4F6B84",
	400: "#7290A8",
	300: "#A3B8CA",
} as const;

const graphite = {
	900: "#0F0F17",
	800: "#1C1F25",
	700: "#2A2D33",
	500: "#60676F",
	300: "#A6ADB5",
} as const;

const ink = {
	white: "#FFFFFF",
	100: "#F4F6F8",
	200: "#DCE3EA",
} as const;

const semantic = {
	green: "#2FD08A",
	amber: "#FFB547",
	red: "#FF4D5E",
	blue: "#4DA3FF",
	gold: "#FFC94D",
	silver: "#C9D3DE",
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
	bgApp: slate[900],
	bgScreenBase: "#16263A",
	bgPhotoDim: "rgba(0,0,0,.2)",
	bgVideo: "#0E151C",
	splashTrack: "rgba(255,255,255,.15)",
	dotIdle: "rgba(255,255,255,.3)",
	orbitRingOuter: "rgba(255,255,255,.035)",
	orbitRingInner: "rgba(255,255,255,.05)",
	bgElevated: slate[800],
	bgSunken: slate[950],

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
	glassDark: "rgba(36,52,68,.50)",
	glassTintBlue: "rgba(114,144,168,.22)",
	glassBorder: "rgba(255,255,255,.16)",
	glassBorderStrong: "rgba(255,255,255,.45)",
	glassHighlight: "rgba(255,255,255,.45)",
	glassPanel: "rgba(40,58,76,.62)",
	glassToast: "rgba(40,58,76,.55)",
	glassTooltip: "rgba(40,58,76,.6)",
	glassLight: "rgba(255,255,255,.9)",
	hairline: "rgba(255,255,255,.14)",

	// Superfícies
	surfaceInput: "rgba(255,255,255,.10)",
	surfaceScrim: "rgba(20,30,40,.55)",
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
	statusInfoSoft: "rgba(77,163,255,.16)",

	// Pódio (só posições 1–3)
	rankGold: semantic.gold,
	rankSilver: semantic.silver,
	rankBronze: semantic.bronze,

	// Mapa
	route: orange[500],

	// Tendência no ranking (feed)
	trendUp: "#2FD08A",
	trendDown: "#FF5A5A",
	// Arte do post (foto da corrida com marca PACE TEAM)
	postRoute: "#E8641E",
	postBadgeBg: "rgba(22,26,30,.88)",
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
	storyPillBg: "rgba(18,22,26,.82)",
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
	storySilver: "#D5DCE4",
	storyBronze: "#E0915A",
	checkerA: "#3A4652",
	checkerB: "#4A5662",
	shareTabActive: "rgba(255,255,255,.2)",
	shareTabActiveBorder: "rgba(255,255,255,.55)",
	// Mapa: cartões de rota, nota de privacidade e pontos do carrossel
	routeCardOn: "rgba(255,255,255,.18)",
	routeCardOff: "rgba(255,255,255,.1)",
	routeCardBorderOn: "rgba(253,90,12,.6)",
	mapNoteBg: "rgba(40,58,76,.6)",
	pagerDotOff: "rgba(255,255,255,.35)",
	// Equipe: medalhas do pódio semanal, linhas de integrantes e vagas
	medalGoldGlow: "rgba(246,201,76,.75)",
	medalSilverGlow: "rgba(213,220,228,.6)",
	medalBronzeGlow: "rgba(224,145,90,.6)",
	medalGoldInk: "#5A3B00",
	medalSilverInk: "#2E3A46",
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
	routeThumbBg: "rgba(1,13,24,.6)",
	healthNoteBg: "rgba(77,163,255,.1)",
	healthNoteBorder: "rgba(77,163,255,.25)",
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

import splashVideo from "../../../../assets/video/splash-v2.mp4";

export const SPLASH_VIDEO = splashVideo;

export const SPLASH_COPY = {
	sloganTop: "CORRA JUNTO.",
	sloganBottom: "SUBA NO RANKING.",
} as const;

// Tempos e deslocamentos da abertura (pt-splash-logo / slogan / bar)
export const SPLASH_TIMING = {
	total: 2800,
	// Espera máxima pelo vídeo antes de começar a abertura (ms)
	videoWaitMax: 5000,
	logo: 1400,
	slogan: 800,
	sloganDelay: 900,
	logoOffset: -24,
	logoSkew: -8,
	sloganOffset: 8,
} as const;

export const LOGO_HEIGHT = 74;

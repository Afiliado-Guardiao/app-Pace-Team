import welcomeVideo from "../../../../assets/video/welcome-v2.mp4";

export const WELCOME_VIDEO = welcomeVideo;

export const WELCOME_COPY = {
	slogan: "Corra junto. Suba no ranking.",
	title: "Sua corrida vale pontos para o seu time",
	termsStart: "Ao continuar, você aceita os ",
	terms: "Termos de Uso",
	and: " e a ",
	privacy: "Política de Privacidade",
	termsEnd:
		". A câmera e a galeria só são usadas quando você escolhe tirar ou enviar uma foto, e pedimos sua permissão antes.",
	apple: "Continuar com Apple",
	google: "Continuar com Google",
	email: "Entrar com e-mail e senha",
	catalog: "Catálogo PACE (dev)",
} as const;

export const WELCOME_TOASTS = {
	appleUnavailable: {
		tone: "info",
		title: "Login com Apple",
		message: "Disponível no app instalado no iPhone. Use e-mail e senha por enquanto.",
	},
	appleError: {
		tone: "warning",
		title: "Não deu para entrar com Apple",
		message: "Tente de novo ou use e-mail e senha.",
	},
	google: {
		tone: "info",
		title: "Login com Google em breve",
		message: "Use e-mail e senha por enquanto.",
	},
	legal: {
		tone: "info",
		title: "Documento em preparação",
		message: "Os termos e a política entram antes da publicação na App Store.",
	},
} as const;

export const WELCOME_ROUTES = { CATALOG: "/catalog" } as const;

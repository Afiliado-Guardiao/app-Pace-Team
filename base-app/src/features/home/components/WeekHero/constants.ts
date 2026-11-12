import { IWeatherPreset } from "@/lib/weather";

// Cor do ícone do selo do clima (amarelo no sol, azul claro no frio/chuva)
export const WEATHER_ICON_COLORS: Record<IWeatherPreset, string> = {
	day: "#FFC94D",
	cloudy: "#D5DEE8",
	hot: "#FFC94D",
	cold: "#BFE0FF",
	night: "#E4ECF7",
	rain: "#BFE0FF",
	storm: "#BFE0FF",
};

// Pulinho dos dois cards ao abrir o Início (pontos primeiro, equipe depois)
const TILE_HOP = {
	"0%": { transform: [{ translateY: 0 }, { scaleY: 1 }] },
	"28%": { transform: [{ translateY: -16 }, { scaleY: 1.02 }] },
	"52%": { transform: [{ translateY: 0 }, { scaleY: 0.95 }] },
	"72%": { transform: [{ translateY: -6 }, { scaleY: 1 }] },
	"100%": { transform: [{ translateY: 0 }, { scaleY: 1 }] },
} as const;

export const tileHop = (delayMs: number) =>
	({
		animationName: TILE_HOP,
		animationDuration: "720ms",
		animationDelay: `${String(delayMs)}ms`,
		animationTimingFunction: "ease-out",
		animationIterationCount: 1,
		animationFillMode: "both",
		transformOrigin: "50% 100%",
	}) as const;

export const HOP_POINTS = tileHop(450);
export const HOP_TEAM = tileHop(620);

import { IMapRegionBubble } from "@/components/shared/RunMap";
import { ROUTE, ROUTE_CENTER } from "@/lib/run";

export const MAP_COPY = {
	title: "Mapa",
	locate: "Centralizar",
	mine: "Minhas rotas",
	teams: "Equipes por região",
	empty: "Suas rotas aparecem aqui depois da primeira corrida.",
	privacy: "Dados agregados por região. Nunca mostramos a localização de outros atletas.",
} as const;

export const MAP_SCOPES = ["Cidade", "Estado", "País"] as const;

export const MAP_REGIONS: readonly IMapRegionBubble[] = [
	{ center: [-23.584, -46.658], radius: 650, count: "18", label: "equipes" },
	{ center: [-23.576, -46.668], radius: 420, count: "7", label: "equipes" },
	{ center: [-23.595, -46.646], radius: 480, count: "11", label: "equipes" },
];

// Variações da volta de exemplo (girada, reduzida e deslocada) para que cada
// rota salva desenhe um traçado diferente: [graus, escala, Δlat, Δlng]
const VARIANTS = [
	[0, 1, 0, 0],
	[52, 0.72, 0.0042, -0.0036],
	[-38, 0.86, -0.0035, 0.0028],
	[118, 0.64, 0.0016, 0.0049],
	[-96, 0.78, -0.0046, -0.0022],
] as const;

export const SAVED_ROUTES: readonly (readonly (readonly [number, number])[])[] = VARIANTS.map(
	([deg, scale, dLat, dLng]) => {
		const t = (deg * Math.PI) / 180;
		const cos = Math.cos(t);
		const sin = Math.sin(t);
		const [cLat, cLng] = ROUTE_CENTER;
		return ROUTE.map(([lat, lng]) => {
			const y = (lat - cLat) * scale;
			const x = (lng - cLng) * scale;
			return [cLat + y * cos - x * sin + dLat, cLng + y * sin + x * cos + dLng] as const;
		});
	},
);

// Cartão do carrossel: largura + espaço entre cartões
export const ROUTE_CARD = { width: 220, gap: 10 } as const;

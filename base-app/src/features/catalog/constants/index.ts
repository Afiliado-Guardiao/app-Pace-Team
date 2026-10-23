// Dados de exemplo do protótipo do Cloud Design (Shell.jsx), só para o catálogo.
import crew1 from "../../../../assets/photos/crew/crew-1.jpg";
import crew2 from "../../../../assets/photos/crew/crew-2.jpg";
import crew3 from "../../../../assets/photos/crew/crew-3.jpg";
import crew4 from "../../../../assets/photos/crew/crew-4.jpg";
import teamTrack from "../../../../assets/photos/team-track.jpg";
import { ICatalogTeam } from "../types";

export const CREW_PHOTOS = { crew1, crew2, crew3, crew4 };
export const PHOTO_CARD = teamTrack;

export const MEMBERS = [
	{ name: "Lucas Moreira", src: crew1 },
	{ name: "Ana Souza", src: crew2 },
	{ name: "Rafael Lima", src: crew3 },
	{ name: "Bia Carvalho", src: crew4 },
	{ name: "Diego Prado" },
	{ name: "Marina Alves" },
];

export const TEAMS: readonly ICatalogTeam[] = [
	{ name: "Lobos SP", city: "Campinas", points: "3.120", km: 241, delta: 0 },
	{ name: "Night Runners", city: "Campinas", points: "2.980", km: 230, delta: 1 },
	{ name: "Trail Kings", city: "Valinhos", points: "2.755", km: 214, delta: -1 },
	{ name: "Pace Sharks", city: "Campinas", points: "2.140", km: 182, delta: 2, isYou: true },
	{ name: "Asfalto Quente", city: "Campinas", points: "2.055", km: 176, delta: -1 },
];

export const CHIP_OPTIONS = ["Semana", "Mês", "Temporada"] as const;
export const RANK_SCOPES = ["Cidade", "Região", "Estado", "País"] as const;
export const TEAM_SIZES = [
	{ value: "3x3", label: "3x3", description: "Times de 3 atletas" },
	{ value: "5x5", label: "5x5", description: "Times de 5 atletas" },
	{ value: "10x10", label: "10x10", description: "Times de 10 atletas" },
] as const;
export const CITIES = ["Campinas", "São Paulo", "Valinhos", "Paulínia"];
export const STATES = ["SP", "RJ", "MG", "PR"];

export const ICON_SAMPLES = [
	"house",
	"footprints",
	"trophy",
	"users",
	"user-round",
	"bell",
	"map-pin",
	"timer",
	"gauge",
	"route",
	"flame",
	"zap",
	"medal",
	"crown",
	"shield-check",
	"play",
	"pause",
	"square",
] as const;

export const BADGE_TONES = [
	"accent",
	"success",
	"warning",
	"danger",
	"info",
	"neutral",
	"solid",
] as const;
export const BUTTON_VARIANTS = ["primary", "glass", "outline", "ghost", "light"] as const;
export const ICON_BUTTON_VARIANTS = ["glass", "accent", "dark", "light"] as const;
export const TOAST_TONES = ["accent", "success", "warning", "danger", "info"] as const;
export const CARD_VARIANTS = ["default", "strong", "dark", "accent"] as const;
export const LOGO_VARIANTS = [
	"horizontal",
	"white",
	"symbol",
	"icon",
	"iconMono",
	"iconOutline",
] as const;

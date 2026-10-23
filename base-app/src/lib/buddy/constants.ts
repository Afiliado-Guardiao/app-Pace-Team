// Pace Buddy — dados do design "Pace Buddy - Mascote dinâmico" (Cloud Design),
// copiados sem alteração: metas, acessórios, cores e animações.

// Metas de km do seletor do painel
export const BUDDY_KMS = [1, 2, 3, 5, 8, 10, 12, 15, 21, 42] as const;
export const BUDDY_DEFAULT_KM_INDEX = 3;

export type IBuddyAccessoryId =
	| "faixa"
	| "grau"
	| "oculos"
	| "bone"
	| "boneTras"
	| "coroa"
	| "aureola"
	| "capa";
export type IBuddySlot = "head" | "eyes" | "back";

export interface IBuddyAccessory {
	id: IBuddyAccessoryId;
	name: string;
	slot: IBuddySlot;
	// Metas cumpridas para liberar (ou só para o líder da equipe)
	need?: number;
	leader?: boolean;
}

export const BUDDY_ACCESSORIES: readonly IBuddyAccessory[] = [
	{ id: "faixa", name: "Faixa", slot: "head", need: 3 },
	{ id: "grau", name: "Óculos de grau", slot: "eyes", need: 5 },
	{ id: "oculos", name: "Óculos", slot: "eyes", need: 8 },
	{ id: "bone", name: "Boné", slot: "head", need: 15 },
	{ id: "boneTras", name: "Boné p/ trás", slot: "head", need: 22 },
	{ id: "coroa", name: "Coroa", slot: "head", leader: true },
	{ id: "aureola", name: "Auréola", slot: "head", need: 30 },
	{ id: "capa", name: "Capa", slot: "back", need: 50 },
];

// Ordem de desenho (o que fica por cima)
export const BUDDY_ACC_ORDER: readonly IBuddyAccessoryId[] = [
	"oculos",
	"grau",
	"faixa",
	"bone",
	"boneTras",
	"coroa",
	"aureola",
];

export type IBuddyColorId =
	| "branco"
	| "lilas"
	| "azul"
	| "verde"
	| "amarelo"
	| "bronze"
	| "prata"
	| "ouro";

export interface IBuddyPalette {
	name: string;
	// Degradê do corpo: brilho → sombra
	c: readonly [string, string, string, string];
	sh: string;
	tier?: boolean;
	metal?: boolean;
	spark?: boolean;
	// Metálicos: cromado, brilho em volta e cor do selo
	m?: readonly [string, string, string, string, string, string];
	glow?: string;
	ink?: string;
}

export const BUDDY_COLORS: Record<IBuddyColorId, IBuddyPalette> = {
	branco: {
		name: "Branco",
		c: ["#ffffff", "#f8f9fb", "#e4e8ee", "#c7ced8"],
		sh: "rgba(128,140,160,.32)",
	},
	lilas: {
		name: "Lilás",
		c: ["#D6D0FF", "#B3A8FF", "#8F80F2", "#6E5CD9"],
		sh: "rgba(70,50,170,.35)",
	},
	azul: {
		name: "Azul",
		c: ["#BDE6FF", "#7FCBFF", "#4AAEF5", "#2589D6"],
		sh: "rgba(20,80,160,.35)",
	},
	verde: {
		name: "Verde",
		c: ["#B5F5D3", "#73E0A6", "#45C786", "#2BA067"],
		sh: "rgba(20,110,60,.35)",
	},
	amarelo: {
		name: "Amarelo",
		c: ["#FFE3A3", "#FFCB5C", "#F7B031", "#D98E14"],
		sh: "rgba(150,90,0,.35)",
	},
	bronze: {
		name: "Bronze",
		tier: true,
		metal: true,
		m: ["#FFE6CC", "#F0A86A", "#7A3A12", "#52250A", "#F09A5C", "#A2552A"],
		c: ["#F8D2AE", "#D9884E", "#A9602E", "#6E3A18"],
		sh: "rgba(80,35,10,.5)",
		glow: "rgba(217,136,78,.6)",
		ink: "#F2B98A",
	},
	prata: {
		name: "Prata",
		tier: true,
		metal: true,
		m: ["#FFFFFF", "#E9EEF3", "#6C7885", "#3A4450", "#EEF2F6", "#9FAAB5"],
		c: ["#FFFFFF", "#DDE4EC", "#A9B6C4", "#6F7D8C"],
		sh: "rgba(60,72,88,.5)",
		glow: "rgba(201,211,222,.6)",
		ink: "#DDE4EC",
	},
	ouro: {
		name: "Ouro",
		tier: true,
		metal: true,
		spark: true,
		m: ["#FFFCE8", "#FFE27A", "#9A6400", "#6E4300", "#FFD23F", "#C98A0B"],
		c: ["#FFF6CC", "#FFD45C", "#E0A526", "#9A6410"],
		sh: "rgba(110,70,0,.5)",
		glow: "rgba(255,201,77,.75)",
		ink: "#FFD45C",
	},
};

export const BUDDY_FREE_COLORS: readonly IBuddyColorId[] = [
	"branco",
	"lilas",
	"azul",
	"verde",
	"amarelo",
];
export const BUDDY_TIER_COLORS: readonly IBuddyColorId[] = ["bronze", "prata", "ouro"];

export type IBuddyRank = "none" | "bronze" | "prata" | "ouro";

export type IBuddyAct =
	| "idle"
	| "wave"
	| "look"
	| "lookL"
	| "arm"
	| "armsUp"
	| "salute"
	| "tilt"
	| "excited"
	| "curious"
	| "sleep"
	| "peek"
	| "celebrate"
	| "shake"
	| "wake"
	| "impressed"
	| "sick"
	| "wink";

export type IBuddyPhase = "legs" | "run" | "ring" | "max" | "dash" | null;

// Dias sem correr para o Buddy aparecer doente
export const BUDDY_SICK_DAYS = 7;

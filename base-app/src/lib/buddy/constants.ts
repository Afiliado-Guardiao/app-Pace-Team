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
	| "capa"
	// PACE BUDDY STUDIO (Team Pro): só estilo, sem vantagem
	| "fone"
	| "viseira"
	| "faixaNeon"
	| "espelhado"
	| "narigao"
	| "samurai"
	| "heroi"
	| "robo"
	| "raio"
	| "ninja"
	| "paraquedas"
	| "espadas"
	| "vampiro";

// Acessórios de costas (desenhados atrás do corpo)
export const BUDDY_BACK_ACCESSORIES = ["capa", "paraquedas", "espadas"] as const;
export type IBuddyBackAccessoryId = (typeof BUDDY_BACK_ACCESSORIES)[number];
export type IBuddySlot = "head" | "eyes" | "back" | "mouth";

export interface IBuddyAccessory {
	id: IBuddyAccessoryId;
	name: string;
	slot: IBuddySlot;
	// Metas cumpridas para liberar (ou só para o líder da equipe)
	need?: number;
	leader?: boolean;
	// Item do Buddy Studio (Team Pro)
	pro?: boolean;
}

export const BUDDY_ACCESSORIES: readonly IBuddyAccessory[] = [
	{ id: "faixa", name: "Faixa", slot: "head", need: 3 },
	{ id: "grau", name: "Óculos de grau", slot: "eyes", need: 5 },
	{ id: "oculos", name: "Óculos", slot: "eyes", need: 8 },
	{ id: "bone", name: "Boné", slot: "head", need: 15 },
	{ id: "boneTras", name: "Boné p/ trás", slot: "head", need: 22 },
	{ id: "aureola", name: "Auréola", slot: "head", need: 30 },
	{ id: "capa", name: "Capa", slot: "back", need: 50 },
];

// Coroa: não é acessório de escolher. Vai sozinha para o 1º do ranking da
// semana na equipe, por cima de qualquer acessório (o atleta pode esconder)
export const BUDDY_CROWN: IBuddyAccessoryId = "coroa";

// Ordem de desenho (o que fica por cima)
export const BUDDY_ACC_ORDER: readonly IBuddyAccessoryId[] = [
	"oculos",
	"espelhado",
	"grau",
	"faixa",
	"faixaNeon",
	"bone",
	"boneTras",
	"viseira",
	"fone",
	"ninja",
	"samurai",
	"heroi",
	"raio",
	"narigao",
	"robo",
	"vampiro",
	"coroa",
	"aureola",
];

// Acessórios do Buddy Studio: só para quem tem o Team Pro
export const BUDDY_PRO_ACCESSORIES: readonly IBuddyAccessory[] = [
	{ id: "fone", name: "Fone", slot: "head", pro: true },
	{ id: "viseira", name: "Viseira", slot: "head", pro: true },
	{ id: "faixaNeon", name: "Faixa neon", slot: "head", pro: true },
	{ id: "espelhado", name: "Óculos espelhado", slot: "eyes", pro: true },
	{ id: "narigao", name: "Óculos de nariz", slot: "eyes", pro: true },
	{ id: "samurai", name: "Samurai", slot: "eyes", pro: true },
	{ id: "heroi", name: "Herói-teia", slot: "eyes", pro: true },
	{ id: "robo", name: "Robô", slot: "eyes", pro: true },
	{ id: "raio", name: "Máscara do raio", slot: "eyes", pro: true },
	{ id: "ninja", name: "Ninja", slot: "eyes", pro: true },
	{ id: "paraquedas", name: "Paraquedas", slot: "back", pro: true },
	{ id: "espadas", name: "Espadas", slot: "back", pro: true },
	{ id: "vampiro", name: "Dentes de vampiro", slot: "mouth", pro: true },
];

export type IBuddyColorId =
	| "branco"
	| "lilas"
	| "azul"
	| "verde"
	| "amarelo"
	| "bronze"
	| "prata"
	| "ouro"
	// Cores do Buddy Studio (Team Pro)
	| "neon"
	| "galaxia"
	| "oceano"
	| "coral"
	| "grafite"
	| "lava";

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
	// Cor do Buddy Studio (Team Pro)
	pro?: boolean;
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
	neon: {
		name: "Neon",
		pro: true,
		c: ["#FFC2E8", "#FF6FC4", "#F23B9E", "#B8167A"],
		sh: "rgba(150,10,100,.4)",
	},
	galaxia: {
		name: "Galáxia",
		pro: true,
		c: ["#C9B8FF", "#7B5CF0", "#3F2AA8", "#1B1260"],
		sh: "rgba(20,10,80,.55)",
	},
	oceano: {
		name: "Oceano",
		pro: true,
		c: ["#B5FFF4", "#4FE0D2", "#16A8B8", "#0B6A86"],
		sh: "rgba(5,70,90,.45)",
	},
	coral: {
		name: "Coral",
		pro: true,
		c: ["#FFD9CC", "#FF9E80", "#FF6A4D", "#D9412B"],
		sh: "rgba(160,40,20,.4)",
	},
	grafite: {
		name: "Grafite",
		pro: true,
		c: ["#9AA6B4", "#5C6876", "#353F4B", "#1A2129"],
		sh: "rgba(0,0,0,.55)",
	},
	lava: {
		name: "Lava",
		pro: true,
		c: ["#FFE08A", "#FF9A2E", "#F0461E", "#8F1306"],
		sh: "rgba(120,20,0,.5)",
	},
};

export const BUDDY_PRO_COLORS: readonly IBuddyColorId[] = [
	"neon",
	"galaxia",
	"oceano",
	"coral",
	"grafite",
	"lava",
];

// Efeitos do Buddy Studio em volta do Buddy
export type IBuddyEffectId =
	| "tontura"
	| "coracoes"
	| "notas"
	| "fogo"
	| "chuva"
	| "raios"
	| "faiscas"
	| "estrelas"
	| "aura";

export const BUDDY_PRO_EFFECTS: readonly { id: IBuddyEffectId; name: string }[] = [
	{ id: "tontura", name: "Tontura" },
	{ id: "coracoes", name: "Corações" },
	{ id: "notas", name: "Notas musicais" },
	{ id: "fogo", name: "Fogo nos pés" },
	{ id: "chuva", name: "Nuvem de chuva" },
	{ id: "raios", name: "Raios" },
	{ id: "faiscas", name: "Faíscas" },
	{ id: "estrelas", name: "Estrelas" },
	{ id: "aura", name: "Aura" },
];

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

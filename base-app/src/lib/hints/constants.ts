// Dicas da primeira vez: cada botão explica o que faz, uma dica por vez,
// escrita à mão com uma setinha. Some quando o atleta toca no botão.

export type IHintId =
	| "bud"
	| "tab-run"
	| "points"
	| "pro"
	| "tab-ranking"
	| "team-tile"
	| "tab-team"
	| "tab-profile";

export interface IHintDef {
	text: string;
	// Ordem em que aparecem (as que estão na tela)
	order: number;
	// Só some de vez quando o atleta toca (senão volta mais tarde)
	isTap: boolean;
}

export const HINTS: Record<IHintId, IHintDef> = {
	bud: { text: "toque no Bud\npara cuidar dele", order: 1, isTap: true },
	"tab-run": { text: "comece uma\ncorrida aqui", order: 2, isTap: true },
	points: { text: "seus pontos: toque\npara ver de onde vêm", order: 3, isTap: true },
	pro: { text: "PACE AI, Studio\ne Analytics", order: 4, isTap: true },
	"tab-ranking": { text: "sua equipe\nno ranking", order: 5, isTap: true },
	"team-tile": { text: "a posição da sua\nequipe na cidade", order: 6, isTap: false },
	"tab-team": { text: "sua equipe\ne convites", order: 7, isTap: true },
	"tab-profile": { text: "seu perfil\ne histórico", order: 8, isTap: true },
};

export const HINT_TIMING = {
	// Antes da primeira dica (a tela assenta)
	firstMs: 2500,
	// Entre uma dica e a próxima
	gapMs: 3500,
	// Quanto tempo cada dica fica na tela se ninguém tocar
	showMs: 6500,
	// Dica de toque que já apareceu tantas vezes sem toque não volta mais
	maxShows: 3,
} as const;

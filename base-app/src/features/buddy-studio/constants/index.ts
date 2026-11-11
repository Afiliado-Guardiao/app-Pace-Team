import { IFloatingToastData } from "@/components/pace";

export type IStudioTab = "cores" | "acessorios" | "efeitos";

export const STUDIO_TABS: readonly { value: IStudioTab; label: string }[] = [
	{ value: "cores", label: "Cores" },
	{ value: "acessorios", label: "Acessórios" },
	{ value: "efeitos", label: "Efeitos" },
];

export const STUDIO_COPY = {
	title: "BUDDY STUDIO",
	tagline: "Deixe o seu Buddy com a sua cara.",
	pro: "PRO",
	none: "Nenhum",
	mine: "Meu visual",
	apply: "Aplicar no meu Buddy",
	applied: "Aplicado",
	reset: "Voltar ao visual conquistado",
	tryHint: "Toque para experimentar. Nada muda até você aplicar.",
	lockedTitle: "Disponível no PACE TEAM PRO",
	lockedBody: "Experimente à vontade. Para usar no seu Buddy, a sua equipe precisa ter o Team Pro.",
	lockedCta: "Conhecer o Team Pro",
	fair: "Tudo o que você conquista correndo continua seu e grátis. O Studio é só estilo, sem vantagem no ranking.",
	effectHint: {
		faiscas: "Faíscas laranja em volta",
		estrelas: "Estrelinhas brilhando",
		aura: "Brilho laranja em volta",
	},
} as const;

export const STUDIO_TOASTS: Record<"applied" | "reset", IFloatingToastData> = {
	applied: {
		tone: "success",
		icon: "check",
		title: "Buddy atualizado!",
		message: "O novo visual já está no app.",
	},
	reset: { tone: "success", icon: "check", title: "Visual conquistado de volta" },
};

export type IProFeatureKey = "ai" | "studio" | "analytics";

export interface IProFeatureInfo {
	icon: string;
	title: string;
	tagline: string;
	bullets: readonly string[];
	why: string;
}

// O que cada recurso Pro faz (a tela que o Free vê antes de assinar)
export const PRO_FEATURES: Record<IProFeatureKey, IProFeatureInfo> = {
	ai: {
		icon: "sparkles",
		title: "PACE AI",
		tagline: "O Buddy vira seu parceiro de treino e responde sobre as suas corridas.",
		bullets: [
			"Resumo da sua semana e do mês",
			"Mostra se você está evoluindo no pace e na distância",
			"Compara corridas e acha a sua melhor",
			"Sugere metas e o que focar na próxima semana",
			"Mostra quem da equipe precisa de uma força",
			"Converse por texto ou por voz",
		],
		why: "Ele usa só as corridas registradas no PACE TEAM: não inventa números e não substitui médico nem treinador.",
	},
	studio: {
		icon: "palette",
		title: "PACE BUDDY STUDIO",
		tagline: "Deixe o seu Buddy com a sua cara.",
		bullets: [
			"Skins exclusivas",
			"Acessórios cosméticos Premium",
			"Efeitos e animações especiais",
			"Temas e combinações de cores",
			"Pré-visualização antes de aplicar",
		],
		why: "Tudo o que você conquista correndo continua grátis e seu. O Studio é só estilo, sem vantagem no ranking.",
	},
	analytics: {
		icon: "chart-column",
		title: "PACE TEAM ANALYTICS",
		tagline: "A equipe inteira em números fáceis de entender.",
		bullets: [
			"Quilômetros da semana e do mês",
			"Comparação com o período anterior",
			"Quem correu e com que frequência",
			"Quanto falta para alcançar a rival",
			"Evolução da equipe no ranking",
		],
		why: "Ajuda o capitão a montar a estratégia. Mostra mais informação, mas não muda pontos nem resultados.",
	},
};

export const PRO_FEATURE_COPY = {
	inPro: "DISPONÍVEL NO PACE TEAM PRO",
	cta: "Conhecer o Team Pro",
	unlocked: "LIBERADO PARA A SUA EQUIPE",
	soon: "Este recurso chega numa próxima atualização do app. O Pro da sua equipe já está garantido.",
	seePlan: "Ver o meu Team Pro",
	openNow: "Abrir agora",
} as const;

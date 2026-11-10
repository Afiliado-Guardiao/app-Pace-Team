// Os 3 recursos do PACE TEAM PRO que o botão do Buddy abre
export type IProFeatureId = "ai" | "studio" | "analytics";

export const PRO_FAB_ITEMS: readonly { id: IProFeatureId; icon: string; label: string }[] = [
	{ id: "ai", icon: "sparkles", label: "PACE AI" },
	{ id: "studio", icon: "palette", label: "BUDDY STUDIO" },
	{ id: "analytics", icon: "chart-column", label: "TEAM ANALYTICS" },
];

export const PRO_FAB_COPY = {
	open: "PACE TEAM PRO",
	close: "Fechar PACE TEAM PRO",
} as const;

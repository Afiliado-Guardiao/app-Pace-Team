import { IRunMode } from "@/lib/run";

export const RUN_COPY = {
	titleStart: "Pronto para",
	titleHighlight: "correr?",
	subtitleSoloTeam: "Cada km soma pontos para ",
	subtitleSoloNoTeam: "Cada km fica no seu histórico. Entre numa equipe para pontuar.",
	subtitleTeam: "Corra junto com quem do time está online agora.",
	gpsSearching: "Procurando GPS…",
	gpsReady: "GPS pronto · ±",
	gpsDenied: "Localização desligada",
	map: "Mapa",
	start: "INICIAR",
	distance: "Distância",
	time: "Tempo",
	pace: "Ritmo",
	goalHint: "Ajuste dois valores e o terceiro é calculado. Toque no número para digitar.",
	onlineTitleSuffix: " do time online",
	onlineSub: "Abriram o app nos últimos 15 min",
	onlineNone: "Ninguém do time online agora",
	onlineNoneSub: "Quem abrir o app aparece aqui",
	ready: "Prontos",
} as const;

export const RUN_MODES: readonly { mode: IRunMode; icon: string; label: string }[] = [
	{ mode: "free", icon: "infinity", label: "Livre" },
	{ mode: "dist", icon: "route", label: "Distância" },
	{ mode: "time", icon: "timer", label: "Tempo" },
	{ mode: "team", icon: "users", label: "Correr junto" },
];

export const RUN_TOASTS = {
	denied: {
		tone: "warning",
		title: "Precisamos da sua localização",
		message: "Ative em Ajustes → PACE TEAM → Localização → Durante o uso.",
	},
	error: {
		tone: "danger",
		title: "Não deu para iniciar o GPS",
		message: "Tente de novo em instantes.",
	},
} as const;

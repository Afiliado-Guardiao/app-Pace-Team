import { IRunMode } from "@/lib/run";

export const RUN_COPY = {
	titleStart: "Pronto para",
	titleHighlight: "correr?",
	subtitleSolo: "Cada km soma pontos para os Pace Sharks.",
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
	onlineTitle: "3 do time online",
	onlineSub: "Só quem ativou compartilhar ao vivo",
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

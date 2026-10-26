// Textos da tela "Seu Buddy" (atalho e despertador).
export const BUDDY_SCREEN_COPY = {
	title: "Seu Buddy",
	shortcutLabel: "Atalho",
	shortcutTitle: "Dois toques atrás do celular",
	shortcutBody: "Ligue uma vez e o Buddy aparece na tela inicial, sem abrir o app.",
	shortcutDone:
		"Prefere um botão? Segure a tela inicial, toque em + e adicione o widget do PACE TEAM.",
	shortcutUnavailable: "O atalho e o widget funcionam no app instalado no iPhone.",
	openShortcuts: "Abrir Atalhos",
	allowAlways: "Permitir localização Sempre",
	alwaysOk: "Localização liberada para correr pelo atalho.",
	alwaysHint:
		"Para o Buddy medir a corrida sem abrir o app, a localização precisa estar em Sempre.",
	alarmLabel: "Despertador de corrida",
	alarmSwitch: "Buddy me acorda pra correr",
	alarmHint: "Na hora marcada o Buddy toca e aparece com o botão Correr agora.",
} as const;

export const SHORTCUT_STEPS = [
	"No app Atalhos, toque em + › Adicionar Ação, procure Pace Buddy e escolha Chamar Pace Buddy. Toque em OK para salvar.",
	"Abra Ajustes › Acessibilidade › Toque › Tocar Atrás › Toque Duplo.",
	"Role até o fim da lista e, em Atalhos, escolha Chamar Pace Buddy.",
] as const;

// Domingo primeiro, como no calendário do iPhone
export const WEEK_DAYS = ["D", "S", "T", "Q", "Q", "S", "S"] as const;
export const ALARM_MINUTE_STEP = 5;

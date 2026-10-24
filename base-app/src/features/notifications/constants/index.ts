export const NOTIFICATIONS_COPY = {
	title: "Notificações",
	unread: " não lidas",
	markAll: "Marcar todas como lidas",
	accept: "Aceitar",
	decline: "Recusar",
	prefsTitle: "Preferências",
	save: "Salvar",
	empty:
		"Nada novo por aqui. Corridas do time, ultrapassagens, convites e desafios concluídos aparecem nesta lista.",
} as const;

export const NOTIFICATION_GROUPS = ["Hoje", "Esta semana"] as const;

export const NOTIFICATION_PREFS = [
	{ label: "Mudanças no ranking", on: true },
	{ label: "Convites para equipes", on: true },
	{ label: "Corridas dos integrantes", on: true },
	{ label: "Novos desafios", on: false },
	{ label: "Resultado semanal", on: true },
] as const;

export const NOTIFICATION_TOASTS = {
	accepted: {
		tone: "success",
		title: "Convite aceito",
		message: "",
	},
	acceptedPrefix: "Agora você corre com ",
	declined: { tone: "info", title: "Convite recusado" },
} as const;

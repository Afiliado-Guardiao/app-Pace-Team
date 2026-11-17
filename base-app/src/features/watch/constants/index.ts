import { IFloatingToastData } from "@/components/pace";

export const WATCH_COPY = {
	title: "Relógio e Apple Saúde",
	heroTitle: "Correu com o relógio? Vale ponto.",
	heroBody:
		"Conecte o PACE TEAM ao app Saúde do iPhone. As corridas que o seu relógio salvar lá entram sozinhas no seu histórico e somam pontos para você e para a equipe.",
	connect: "Conectar ao Apple Saúde",
	connecting: "Abrindo…",
	syncNow: "Buscar corridas agora",
	syncing: "Buscando…",
	disconnect: "Desconectar",
	connectedTitle: "Conectado",
	since: "Corridas a partir de",
	lastSync: "Última busca",
	never: "ainda não buscou",
	imported: "Corridas do relógio",
	brandsTitle: "Como ligar no seu relógio",
	rules:
		"Vale ponto com as mesmas regras das corridas do app (mínimo 1 minuto e 100 m). Só entram corridas a partir do dia em que você conectou. Correu com o app e o relógio ao mesmo tempo? Conta uma vez só.",
	privacy:
		"O PACE TEAM só lê as suas corridas (distância, tempo, batimentos e percurso). Não escreve nada no app Saúde e não usa esses dados para anúncio.",
	checkAccess:
		"Não chegou nenhuma corrida? Confira em Ajustes › Saúde › Acesso a Dados e Dispositivos › PACE TEAM se as corridas estão liberadas.",
	unavailable: "O app Saúde só existe no iPhone.",
} as const;

export const WATCH_TOASTS = {
	connected: {
		tone: "success",
		icon: "watch",
		title: "Relógio conectado",
		message: "Suas próximas corridas do relógio entram sozinhas.",
	},
	unavailable: {
		tone: "danger",
		icon: "watch",
		title: "Apple Saúde indisponível",
		message: "O app Saúde só existe no iPhone.",
	},
	none: { tone: "info", icon: "watch", title: "Nenhuma corrida nova do relógio" },
	error: {
		tone: "danger",
		icon: "wifi-off",
		title: "Não deu para buscar agora",
		message: "Confira a internet e tente de novo.",
	},
} satisfies Record<string, IFloatingToastData>;

export const importedToast = (count: number): IFloatingToastData => ({
	tone: "success",
	icon: "watch",
	title:
		count === 1 ? "1 corrida do relógio chegou" : `${String(count)} corridas do relógio chegaram`,
});

// Onde ligar o envio ao app Saúde em cada relógio (texto curto, sem prometer
// o caminho exato dos menus, que muda de versão para versão)
export const WATCH_BRANDS: readonly { name: string; how: string }[] = [
	{ name: "Apple Watch", how: "Já vai sozinho: corra com o app Treino (Correr ao ar livre)." },
	{ name: "Garmin", how: "No app Garmin Connect, ligue o Apple Saúde nos apps conectados." },
	{
		name: "Polar, Coros, Suunto, Amazfit",
		how: "No app do relógio, procure Apple Saúde (ou Saúde) e ligue.",
	},
	{ name: "Strava", how: "No Strava, ligue o Apple Saúde em Configurações › Aplicativos." },
];

import { IPaceGradientName } from "@/theme";

export const TEAM_COPY = {
	category: "5 x 5",
	settings: "Configurações da equipe",
	name: "Pace Sharks",
	place: "Campinas · Região Metropolitana · SP",
	position: "Posição",
	points: "Pontos",
	collectiveKm: "Km coletivos",
	invite: "Convidar amigos",
	ranking: "Ver ranking",
	podiumTitle: "Pódio da equipe",
	podiumSub: "Esta semana · reinicia na segunda",
	you: "Você",
	membersTitle: "Integrantes · ",
	membersAction: "Detalhes da equipe",
	weekKm: " km na semana",
	switchTeam: "Criar ou entrar em outra equipe",
	missingA: "Você está em ",
	missingB: "º · faltam ",
	missingC: " para o bronze",
	emptyTitleA: "Correr é melhor",
	emptyTitleB: "em ",
	emptyHighlight: "equipe",
	emptyBody: "Crie seu time ou entre em um para começar a pontuar no ranking.",
	inviteFrom: "Night Runners",
	inviteTitle: "Night Runners convidou você",
	inviteSub: "10 x 10 · Campinas · 2 vagas",
	accept: "Aceitar convite",
	decline: "Recusar",
	create: "Criar equipe",
	join: "Entrar em uma equipe",
	inviteTitleSuffix: " convidou você",
	inviteSpots: " vagas",
	errorTitle: "Equipe",
	leaveTitle: "Sair da equipe?",
	leaveBody:
		"Você deixa de pontuar por ela. Se for o capitão, a faixa passa para o integrante mais antigo.",
	leaveConfirm: "Sair da equipe",
	keep: "Continuar na equipe",
	joinTitle: "Entrar em uma equipe",
	joinBody: "Peça ao capitão o código da equipe (fica em Convidar amigos).",
	joinCode: "Código da equipe",
	joinConfirm: "Entrar",
	cancel: "Cancelar",
} as const;

export type IPodiumMetric = "Pontos" | "Km";
export const PODIUM_METRICS: readonly IPodiumMetric[] = ["Pontos", "Km"];

// Ordem visual do pódio: 2º, 1º, 3º, com as alturas das colunas
export const PODIUM_SLOTS = [1, 0, 2] as const;
export const PODIUM_HEIGHTS = [124, 96, 78] as const;

export const MEDALS: readonly {
	name: string;
	gradient: IPaceGradientName;
	glow: "medalGoldGlow" | "medalSilverGlow" | "medalBronzeGlow";
	ink: "medalGoldInk" | "medalSilverInk" | "medalBronzeInk";
}[] = [
	{ name: "Ouro", gradient: "medalGold", glow: "medalGoldGlow", ink: "medalGoldInk" },
	{ name: "Prata", gradient: "medalSilver", glow: "medalSilverGlow", ink: "medalSilverInk" },
	{ name: "Bronze", gradient: "medalBronze", glow: "medalBronzeGlow", ink: "medalBronzeInk" },
];

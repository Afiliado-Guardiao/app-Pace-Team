import { ImageSourcePropType } from "react-native";

export type IRunStatus = "valid" | "pending" | "invalid";

export interface IAthlete {
	name: string;
	handle: string;
	city: string;
}

export interface ITeamSummary {
	name: string;
	city: string;
	size: number;
	rank: number;
	points: number;
	km: number;
}

export interface ITeamMember {
	id?: string;
	name: string;
	role: "Capitão" | "Atleta";
	km: number;
	pts: number;
	you?: boolean;
	// Foto do perfil do atleta (null = iniciais)
	avatarUrl?: string | null;
	// Com o app aberto nos últimos 15 minutos
	isOnline?: boolean;
}

export interface IRankedTeam {
	id?: string;
	name: string;
	city: string;
	points: number;
	km: number;
	delta: number;
	you?: boolean;
	// Escudo que o capitão colocou (null = sigla)
	logoUrl?: string | null;
}

export interface IRun {
	id: number | string;
	title: string;
	date: string;
	km: string;
	// Unidade da distância ("m" abaixo de 1 km; sem ela, "km")
	unit?: string;
	time: string;
	pace: string;
	pts: number;
	status: IRunStatus;
	image: ImageSourcePropType;
	// Percurso gravado pelo GPS (só nas corridas reais; a prévia não tem)
	route?: readonly (readonly [number, number])[];
}

export interface IOnlineFriend {
	name: string;
	image: ImageSourcePropType;
	// Fração do ritmo do usuário e vantagem no percurso (simulação do protótipo)
	pace: number;
	lead: number;
}

// Arte gerada no app (post do próprio atleta): foto + métricas da corrida
export interface IFeedPostArt {
	seconds: number;
	km: number;
	layers: { route: boolean; stats: boolean; badge: boolean };
	// Percurso real (posts reais); sem ele, o traçado de exemplo da prévia
	route?: readonly (readonly [number, number])[];
}

export interface IFeedPost {
	id: string;
	// Autor e foto enviada (posts reais: denunciar, bloquear, apagar)
	authorId?: string;
	// Foto do autor (null = iniciais)
	avatarUrl?: string | null;
	teamId?: string | null;
	teamLogo?: string | null;
	// Post da equipe (foto do grupo): o cabeçalho mostra a equipe
	isTeamPost?: boolean;
	isMine?: boolean;
	imagePath?: string | null;
	image: ImageSourcePropType;
	art?: IFeedPostArt;
	name: string;
	with?: string;
	team: string;
	rank: number;
	up: boolean;
	time: string;
	likes: number;
	// Já curtido por mim (posts reais do feed)
	isLiked?: boolean;
	comments: number;
	caption: string;
}

export type INotificationTone = "danger" | "accent" | "success" | "neutral";

export interface INotification {
	id: string;
	group: "Hoje" | "Esta semana";
	icon: string;
	tone: INotificationTone;
	title: string;
	sub: string;
	time: string;
	unread?: boolean;
	link?: "disputa" | "team" | "challenges" | "ranking" | "team_run";
	invite?: boolean;
}

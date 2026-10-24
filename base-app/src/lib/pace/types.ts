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
}

export interface IRankedTeam {
	id?: string;
	name: string;
	city: string;
	points: number;
	km: number;
	delta: number;
	you?: boolean;
}

export interface IRun {
	id: number | string;
	title: string;
	date: string;
	km: string;
	time: string;
	pace: string;
	pts: number;
	status: IRunStatus;
	image: ImageSourcePropType;
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
}

export interface IFeedPost {
	id: string;
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
	link?: "disputa" | "team" | "challenges" | "ranking";
	invite?: boolean;
}

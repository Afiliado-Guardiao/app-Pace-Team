import { ImageSourcePropType } from "react-native";

import challenges from "../../../../assets/prizes/constancia.png";
import teamPrize from "../../../../assets/prizes/team_record.png";
import virada from "../../../../assets/prizes/team_streak.png";
import shotChallenges from "../../../../assets/showcase/challenges.jpg";
import shotFeed from "../../../../assets/showcase/feed.jpg";
import shotHome from "../../../../assets/showcase/home.jpg";
import shotMap from "../../../../assets/showcase/map.jpg";
import shotRanking from "../../../../assets/showcase/ranking.jpg";
import shotShare from "../../../../assets/showcase/share.jpg";
import shotTeam from "../../../../assets/showcase/team.jpg";
import shotVirada from "../../../../assets/showcase/virada.jpg";

export interface IShowcaseBadge {
	art: ImageSourcePropType;
	label: string;
	title: string;
	tone: "gold" | "green";
}

export interface IShowcaseScene {
	id: string;
	// Tela real do app (null = a cena animada "Chame o Buddy")
	image: ImageSourcePropType | null;
	ms: number;
	icon: string;
	title: string;
	sub: string;
	badge?: IShowcaseBadge;
}

// As 9 cenas do celular de vitrine (tempos do Cloud Design)
export const SCENES: readonly IShowcaseScene[] = [
	{
		id: "home",
		image: shotHome,
		ms: 2300,
		icon: "cloud-rain",
		title: "Clima ao vivo na pista",
		sub: "Sua equipe correndo agora",
	},
	{
		id: "buddy",
		image: null,
		ms: 5600,
		icon: "hand",
		title: "Chame o Buddy",
		sub: "2 toques atrás do celular",
	},
	{
		id: "ranking",
		image: shotRanking,
		ms: 2300,
		icon: "mountain",
		title: "Ranking até o cume",
		sub: "Suba com sua equipe",
	},
	{
		id: "challenges",
		image: shotChallenges,
		ms: 2300,
		icon: "medal",
		title: "Ganhe medalhas",
		sub: "Desafios e conquistas",
		badge: { art: challenges, label: "MEDALHA CONQUISTADA", title: "Semana de fogo", tone: "gold" },
	},
	{
		id: "team",
		image: shotTeam,
		ms: 2300,
		icon: "trophy",
		title: "Ouro, prata e bronze",
		sub: "Disputa dentro da equipe",
		badge: { art: teamPrize, label: "1º DA EQUIPE", title: "Melhor pace da semana", tone: "gold" },
	},
	{
		id: "virada",
		image: shotVirada,
		ms: 2300,
		icon: "zap",
		title: "Modo Virada",
		sub: "Ultrapasse a equipe rival",
		badge: { art: virada, label: "VIRADA CONCLUÍDA", title: "Pace Sharks em 3º", tone: "green" },
	},
	{
		id: "share",
		image: shotShare,
		ms: 3800,
		icon: "share-2",
		title: "Compartilhe sua corrida",
		sub: "Layouts sem fundo para seus stories",
	},
	{
		id: "feed",
		image: shotFeed,
		ms: 4200,
		icon: "images",
		title: "Poste com seus amigos",
		sub: "Fotos da equipe no feed",
	},
	{
		id: "map",
		image: shotMap,
		ms: 2300,
		icon: "map",
		title: "Corridas no mapa",
		sub: "Rotas e percursos salvos",
	},
];

export const SHOWCASE_COPY = {
	lineA: "CORRA JUNTO.",
	lineB: "SUBA NO RANKING.",
	sub: "Transforme suas corridas em desafios, conquistas e competição com amigos.",
	cta: "COMEÇAR",
	login: "Já tenho uma conta",
	lockTime: "9:41",
	lockDate: "Sábado, 9 de novembro",
	cardTitle: "Bora correr?",
	cardSub: "Chama a galera e escolhe os km.",
	cardSolo: "Correr sozinho",
	cardTeam: "Correr com a equipe",
	cardGoal: "META  ‹ 5 km ›",
	cardLater: "Agora não",
} as const;

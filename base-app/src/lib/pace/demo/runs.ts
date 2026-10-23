import { CREW, PHOTOS } from "../images";
import { IOnlineFriend, IRun } from "../types";

export const RUNS: readonly IRun[] = [
	{
		id: 1,
		title: "Corrida da manhã",
		date: "Hoje · 06:42",
		km: "10,58",
		time: "54:12",
		pace: "5'07\"",
		pts: 86,
		status: "pending",
		image: PHOTOS.runnerCitySunset,
	},
	{
		id: 2,
		title: "Treino intervalado",
		date: "Ter, 13 out · 19:10",
		km: "6,20",
		time: "31:48",
		pace: "5'08\"",
		pts: 52,
		status: "valid",
		image: PHOTOS.citySkylineDusk,
	},
	{
		id: 3,
		title: "Longão de domingo",
		date: "Dom, 11 out · 07:05",
		km: "15,60",
		time: "1:24:30",
		pace: "5'25\"",
		pts: 128,
		status: "valid",
		image: PHOTOS.teamRunningSunset,
	},
	{
		id: 4,
		title: "Corrida leve",
		date: "Sex, 9 out · 18:30",
		km: "4,10",
		time: "23:55",
		pace: "5'50\"",
		pts: 0,
		status: "invalid",
		image: PHOTOS.citySkylineDusk,
	},
];

// Quem do time está online para "Correr junto" (só quem ativou compartilhar ao vivo)
export const ONLINE: readonly IOnlineFriend[] = [
	{ name: "Ana Souza", image: CREW[0], pace: 0.97, lead: 0.09 },
	{ name: "Rafael Lima", image: CREW[1], pace: 0.86, lead: 0.04 },
	{ name: "Bia Carvalho", image: CREW[3], pace: 0.78, lead: -0.07 },
];

// Corrida da equipe (detalhe a partir do card do Início)
export const GROUP_RUN = [
	{ name: "Lucas Moreira", km: 10.58, time: "54:12", pace: "5'07\"", pts: 86, you: true },
	{ name: "Ana Souza", km: 10.58, time: "52:40", pace: "4'59\"", pts: 86 },
	{ name: "Rafael Lima", km: 8.2, time: "43:18", pace: "5'17\"", pts: 66 },
	{ name: "Bia Carvalho", km: 7.4, time: "41:05", pace: "5'33\"", pts: 60 },
	{ name: "Diego Prado", km: 5.6, time: "31:22", pace: "5'36\"", pts: 45 },
] as const;

// Parciais por km (detalhe da corrida): ritmo e largura relativa da barra
export const SPLITS = [
	{ pace: "5'02\"", width: 92 },
	{ pace: "5'10\"", width: 86 },
	{ pace: "4'58\"", width: 98 },
	{ pace: "5'14\"", width: 82 },
	{ pace: "5'06\"", width: 90 },
] as const;

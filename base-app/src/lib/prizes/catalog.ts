import { ImageSourcePropType } from "react-native";

import { IMedal, MEDALS } from "@/lib/pace";

import badgeTeam from "../../../assets/prizes/badge_team.png";
import cemKm from "../../../assets/prizes/cem_km.png";
import cemKmLocked from "../../../assets/prizes/cem_km-locked.png";
import coinPoints from "../../../assets/prizes/coin_points.png";
import constancia from "../../../assets/prizes/constancia.png";
import constanciaLocked from "../../../assets/prizes/constancia-locked.png";
import explosao from "../../../assets/prizes/explosao.png";
import explosaoLocked from "../../../assets/prizes/explosao-locked.png";
import lock from "../../../assets/prizes/lock.png";
import madrugador from "../../../assets/prizes/madrugador.png";
import madrugadorLocked from "../../../assets/prizes/madrugador-locked.png";
import ritmo from "../../../assets/prizes/ritmo.png";
import ritmoLocked from "../../../assets/prizes/ritmo-locked.png";
import teamKm from "../../../assets/prizes/team_km.png";
import teamKmLocked from "../../../assets/prizes/team_km-locked.png";
import teamRecord from "../../../assets/prizes/team_record.png";
import teamRecordLocked from "../../../assets/prizes/team_record-locked.png";
import teamStreak from "../../../assets/prizes/team_streak.png";
import teamStreakLocked from "../../../assets/prizes/team_streak-locked.png";
import teamTop5 from "../../../assets/prizes/team_top5.png";
import teamTop5Locked from "../../../assets/prizes/team_top5-locked.png";
import top5 from "../../../assets/prizes/top5.png";
import top5Locked from "../../../assets/prizes/top5-locked.png";

// Prêmios 3D do PACE TEAM (imagens geradas no Gemini pelo Wesley): as 6
// medalhas individuais e as 4 conquistas da equipe. Bloqueado = a mesma
// imagem apagada, em cinza, com o cadeado de prata no canto.
export type ITeamPrizeId = "team_top5" | "team_streak" | "team_km" | "team_record";
export type IPrizeId = IMedal["id"] | ITeamPrizeId;

export interface IPrize {
	id: IPrizeId;
	kind: "medal" | "team";
	title: string;
	rule: string;
	image: ImageSourcePropType;
	locked: ImageSourcePropType;
}

const MEDAL_ART: Record<IMedal["id"], [ImageSourcePropType, ImageSourcePropType, string]> = {
	top5: [top5, top5Locked, "Top 5 da cidade"],
	cem_km: [cemKm, cemKmLocked, "100 km"],
	madrugador: [madrugador, madrugadorLocked, "Madrugador"],
	constancia: [constancia, constanciaLocked, "Constância"],
	ritmo: [ritmo, ritmoLocked, "Ritmo"],
	explosao: [explosao, explosaoLocked, "Explosão"],
};

const medalPrizes = MEDALS.map((m): IPrize => {
	const [image, locked, title] = MEDAL_ART[m.id];
	return { id: m.id, kind: "medal", title, rule: m.rule, image, locked };
});

const teamPrizes: IPrize[] = [
	{
		id: "team_top5",
		kind: "team",
		title: "Top 5 da equipe",
		rule: "Fechar uma semana entre as 5 melhores equipes da cidade",
		image: teamTop5,
		locked: teamTop5Locked,
	},
	{
		id: "team_streak",
		kind: "team",
		title: "8 semanas seguidas",
		rule: "Correr junto 8 semanas seguidas",
		image: teamStreak,
		locked: teamStreakLocked,
	},
	{
		id: "team_km",
		kind: "team",
		title: "1.000 km",
		rule: "A equipe somar 1.000 km",
		image: teamKm,
		locked: teamKmLocked,
	},
	{
		id: "team_record",
		kind: "team",
		title: "Recorde",
		rule: "Bater o recorde de pontos da equipe numa semana",
		image: teamRecord,
		locked: teamRecordLocked,
	},
];

export const PRIZES: Record<IPrizeId, IPrize> = Object.fromEntries(
	[...medalPrizes, ...teamPrizes].map((p) => [p.id, p]),
) as Record<IPrizeId, IPrize>;

export const PRIZE_ART = { lock, coinPoints, badgeTeam };

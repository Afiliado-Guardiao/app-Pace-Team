import { formatDistance, formatDuration, formatPace } from "@/lib/pace";
import { ITeamGame, ITeamGamePlayer } from "@/lib/supabase";

export interface IResultRow {
	id: string;
	name: string;
	isYou: boolean;
	isDone: boolean;
	// O que precisava cumprir
	goal: string;
	// O que fez ("" = sem essa informação)
	ran: string;
	points: string;
}

const NOT_RUN = "Não correu no prazo";

const goalOf = (p: ITeamGamePlayer): string =>
	p.km != null && p.pace != null
		? `${String(p.km)} km em até ${formatDuration(p.km * p.pace)} (${formatPace(p.pace)}/km)`
		: "—";

const ranOf = (p: ITeamGamePlayer): string => {
	if (p.runKm === undefined) return "";
	if (p.runKm == null || p.runSeconds == null) return NOT_RUN;
	const pace = p.runKm > 0 ? ` (${formatPace(p.runSeconds / p.runKm)}/km)` : "";
	return `${formatDistance(p.runKm)} em ${formatDuration(p.runSeconds)}${pace}`;
};

export const gamePointsText = (points: number): string =>
	`${points < 0 ? "−" : "+"}${String(Math.abs(points))} pts`;

// Resultado de cada um: o desafio, o que fez e os pontos (você primeiro)
export const resultRows = (game: ITeamGame): IResultRow[] =>
	[...game.players]
		.sort((a, b) => Number(b.isYou) - Number(a.isYou) || a.slot - b.slot)
		.map((p) => ({
			id: p.userId,
			name: p.isYou ? "Você" : p.name,
			isYou: p.isYou,
			isDone: p.status === "done",
			goal: goalOf(p),
			ran: ranOf(p),
			points: p.points == null ? "" : gamePointsText(p.points),
		}));

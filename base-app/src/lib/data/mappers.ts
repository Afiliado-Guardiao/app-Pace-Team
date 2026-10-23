// Converte o que vem do Supabase para os formatos que as telas já usam.
import { ImageSourcePropType } from "react-native";

import {
	formatDuration,
	formatKm,
	formatPace,
	IFeedPost,
	IRankedTeam,
	IRun,
	ITeamMember,
	PHOTOS,
	POST_SAMPLE_PHOTOS,
} from "@/lib/pace";
import {
	IFeedRow,
	ISavedRun,
	ITeamMemberStat,
	ITeamRankingEntry,
	postPhotoUrl,
} from "@/lib/supabase";

const NOON = 12;
const EVENING = 18;
const DAY_MS = 86_400_000;
const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const MONTHS = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
// Miniaturas das corridas no histórico (fotos da marca, em rodízio)
const RUN_PHOTOS = [
	PHOTOS.runnerCitySunset,
	PHOTOS.teamTrack,
	PHOTOS.runnerMountain,
	PHOTOS.citySkylineDusk,
];

const pad2 = (n: number): string => String(n).padStart(2, "0");
const clock = (d: Date): string => `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;

export const runTitle = (date: Date): string => {
	const hour = date.getHours();
	if (hour < NOON) return "Corrida da manhã";
	return hour < EVENING ? "Corrida da tarde" : "Corrida da noite";
};

// "Hoje · 06:42", "Ontem · 18:30" ou "Sex, 9 out · 18:30"
export const runDate = (date: Date, now = new Date()): string => {
	const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
	const time = date.getTime();
	if (time >= startOfToday) return `Hoje · ${clock(date)}`;
	if (time >= startOfToday - DAY_MS) return `Ontem · ${clock(date)}`;
	const weekday = WEEKDAYS[date.getDay()] ?? "";
	const month = MONTHS[date.getMonth()] ?? "";
	return `${weekday}, ${String(date.getDate())} ${month} · ${clock(date)}`;
};

// "Desde mar 2026"
export const sinceLabel = (iso: string): string => {
	const d = new Date(iso);
	return `Desde ${MONTHS[d.getMonth()] ?? ""} ${String(d.getFullYear())}`;
};

export const toRun = (run: ISavedRun, index: number): IRun => {
	const date = new Date(run.startedAt);
	return {
		id: run.id,
		title: runTitle(date),
		date: runDate(date),
		km: formatKm(run.km),
		time: formatDuration(run.seconds),
		pace: formatPace(run.km > 0 ? run.seconds / run.km : 0),
		pts: run.points,
		status: run.status,
		image: RUN_PHOTOS[index % RUN_PHOTOS.length] ?? PHOTOS.runnerCitySunset,
	};
};

export const toTeamMember = (m: ITeamMemberStat): ITeamMember => ({
	id: m.id,
	name: m.name || "Atleta",
	role: m.role === "captain" ? "Capitão" : "Atleta",
	km: m.km,
	pts: m.points,
	you: m.isYou,
});

export const toRankedTeam = (t: ITeamRankingEntry): IRankedTeam => ({
	id: t.id,
	name: t.name,
	city: t.city,
	points: t.points,
	km: t.km,
	delta: t.delta,
	you: t.isYou,
});

const postImage = (row: IFeedRow): ImageSourcePropType =>
	row.imagePath
		? { uri: postPhotoUrl(row.imagePath) }
		: (POST_SAMPLE_PHOTOS[row.sample ?? 0] ?? POST_SAMPLE_PHOTOS[0]);

const postTime = (iso: string): string => {
	const minutes = Math.round((Date.now() - new Date(iso).getTime()) / 60_000);
	if (minutes < 1) return "agora";
	if (minutes < 60) return `${String(minutes)} min`;
	const hours = Math.round(minutes / 60);
	return hours < 24 ? `${String(hours)} h` : (runDate(new Date(iso)).split(" · ")[0] ?? "");
};

export const toFeedPost = (row: IFeedRow): IFeedPost => ({
	id: row.id,
	image: postImage(row),
	art: { seconds: row.seconds, km: row.km, layers: row.layers },
	name: row.name || "Atleta",
	team: row.team,
	rank: 0,
	up: true,
	time: postTime(row.createdAt),
	likes: row.likes,
	isLiked: row.isLiked,
	comments: 0,
	caption: row.caption,
});

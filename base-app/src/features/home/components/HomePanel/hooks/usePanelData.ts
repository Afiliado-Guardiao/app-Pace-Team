import {
	useMyPro,
	useMyRuns,
	useMyStats,
	useMyTeam,
	useRanking,
	useTeamAnalytics,
} from "@/lib/data";
import { formatKm, formatPoints, IRankedTeam } from "@/lib/pace";

import { WEEK_PROGRESS } from "../../../constants";
import { useTeamPresence } from "../../../hooks/useTeamPresence";
import { IPanelSectionId, IProSectionId, PANEL_SECTIONS } from "../constants";
import { PANEL_COPY, PRO_COPY, PRO_PREVIEW } from "../copy";

export interface IPanelMember {
	name: string;
	avatarUrl?: string;
	isOnline: boolean;
}

export interface IPanelData {
	titles: Record<IPanelSectionId, { title: string; subtitle: string }>;
	isPro: boolean;
	points: { value: number; fraction: number; lineB: string };
	run: { km: string; time: string; pace: string } | null;
	ranking: {
		pos: string;
		place: string;
		gap: string;
		fraction: number;
		teams: readonly IRankedTeam[];
	} | null;
	team: {
		name: string;
		place: string;
		logoUrl: string | null;
		members: IPanelMember[];
		km: string;
		points: string;
	} | null;
	// Prévia dos recursos do Pro (com os números reais do atleta)
	pro: {
		greeting: string;
		teamName: string;
		teamKm: string;
		// km da equipe nas últimas 8 semanas (a última é a atual)
		weeks: number[];
		weekLabels: string[];
	};
}

const MEMBERS_SHOWN = 5;
const PRO_IDS: readonly IProSectionId[] = ["ai", "hydration", "studio", "analytics"];
const ratio = (a: number, b: number): number => (b > 0 ? Math.max(0, Math.min(1, a / b)) : 0);

// Números reais do atleta para cada seção do painel (nada inventado: sem
// equipe ou sem corrida, a seção mostra o convite para começar)
export const usePanelData = (): IPanelData => {
	const { stats } = useMyStats();
	const { team } = useMyTeam();
	const { runs } = useMyRuns();
	const { isPro } = useMyPro();
	const { teams } = useRanking(team?.size ?? 5, "city");
	const presence = useTeamPresence();
	const { data: analytics } = useTeamAnalytics();
	const me = presence.people.find((p) => p.isMe);
	const weeks = analytics?.weeks ?? [];
	const goal = WEEK_PROGRESS.goal;
	const last = runs.at(0) ?? null;
	const meAt = teams.findIndex((t) => t.you);
	const ahead = meAt > 0 ? teams[meAt - 1] : null;

	const titles = Object.fromEntries(
		PANEL_SECTIONS.map((s) => [s.id, { title: s.label, subtitle: "" }]),
	) as IPanelData["titles"];
	titles.points = {
		title: PANEL_COPY.points.title,
		subtitle: PANEL_COPY.pointsSub(stats.weekRuns),
	};
	titles.buddy = { ...PANEL_COPY.buddy };
	titles.run = { title: PANEL_COPY.run.title, subtitle: PANEL_COPY.run.subtitle };
	titles.wheel = { title: PANEL_COPY.wheel.title, subtitle: PANEL_COPY.wheel.subtitle };
	titles.ranking = {
		title: PANEL_COPY.ranking.title,
		subtitle: team ? `${team.name} · ${team.city}` : PANEL_COPY.ranking.noTeam,
	};
	titles.team = {
		title: PANEL_COPY.team.title,
		subtitle: team
			? PANEL_COPY.team.online(presence.onlineCount, presence.people.length)
			: PANEL_COPY.team.noTeam,
	};
	PRO_IDS.forEach((id) => {
		titles[id] = { title: PRO_COPY[id].title, subtitle: PRO_COPY[id].subtitle };
	});

	return {
		titles,
		isPro,
		points: {
			value: stats.weekPoints,
			fraction: ratio(stats.weekKm, goal),
			lineB:
				stats.weekKm >= goal
					? PANEL_COPY.pointsDone
					: PANEL_COPY.pointsLeft(formatKm(goal - stats.weekKm, 1), goal),
		},
		run: last ? { km: last.km, time: last.time, pace: last.pace } : null,
		ranking: team
			? {
					pos: `${String(team.position)}º`,
					place: PANEL_COPY.ranking.inCity(team.city),
					gap: ahead
						? PANEL_COPY.ranking.gap(formatPoints(ahead.points - team.points), ahead.name)
						: PANEL_COPY.ranking.top,
					fraction: ahead ? ratio(team.points, ahead.points) : 1,
					teams,
				}
			: null,
		team: team
			? {
					name: team.name,
					place: `${team.city} · ${team.category} · ${String(team.position)}º`,
					logoUrl: team.logoUrl,
					members: presence.people.slice(0, MEMBERS_SHOWN).map((m) => ({
						name: m.name.split(" ")[0] ?? m.name,
						avatarUrl: m.avatarUrl,
						isOnline: m.isOnline,
					})),
					km: formatKm(team.km, 1),
					points: formatPoints(team.points),
				}
			: null,
		pro: {
			greeting: PRO_PREVIEW.greeting(me?.name.split(" ")[0] ?? ""),
			teamName: team?.name ?? PANEL_COPY.team.noTeam,
			teamKm: formatKm(weeks.at(-1)?.km ?? team?.km ?? 0, 1),
			weeks: weeks.map((w) => w.km),
			weekLabels: weeks.map((w) => w.start.slice(8, 10) + "/" + w.start.slice(5, 7)),
		},
	};
};

import { useQuery } from "@tanstack/react-query";

import { HEAD_TO_HEAD, MEMBERS, MY_TEAM, RIVAL, TEAMS, VIRADA, WEEK } from "@/lib/pace";
import { getVirada } from "@/lib/supabase";
import { useStore } from "@/store";
import { IS_PREVIEW } from "@/constants/preview";

import { DATA_KEYS } from "./keys";
import { IViradaRankRow, IViradaView, toViradaView } from "./viradaView";

interface IUseViradaReturn {
	// null = sem equipe ou sem rival na mesma categoria e cidade
	virada: IViradaView | null;
	hasTeam: boolean;
	isLoading: boolean;
}

// Base de pontos dos integrantes de exemplo (escala a contribuição na prévia)
const DEMO_POINTS_BASE = 2140;
const DEMO_US = { km: 182, city: "Campinas" };
const DEMO_RIVAL_KM = 214;

// Prévia por link: os três cenários simulados do design.
const demoView = (state: keyof typeof VIRADA): IViradaView => {
	const scenario = VIRADA[state];
	const isDone = state === "done";
	const leader = TEAMS[1] ?? { name: "", city: "", points: 0, km: 0, delta: 0 };
	const us: IViradaRankRow = {
		name: MY_TEAM.name,
		city: DEMO_US.city,
		points: scenario.us,
		km: DEMO_US.km,
		delta: isDone ? 1 : 0,
		you: true,
		position: scenario.pos,
	};
	const rival: IViradaRankRow = {
		name: RIVAL.name,
		city: RIVAL.city,
		points: scenario.rival,
		km: DEMO_RIVAL_KM,
		delta: isDone ? -1 : 0,
		position: scenario.rivalPos,
	};
	const scale = scenario.us / DEMO_POINTS_BASE;
	return {
		state,
		scenario,
		title: null,
		team: { name: MY_TEAM.name, city: DEMO_US.city },
		rival: { name: RIVAL.name, city: RIVAL.city },
		move: isDone
			? `Agora em ${String(scenario.pos)}º`
			: `${String(scenario.pos)}º → ${String(scenario.rivalPos)}º`,
		rows: [{ ...leader, delta: 0, position: 2 }, ...(isDone ? [us, rival] : [rival, us])],
		week: { us: WEEK.us, them: WEEK.them },
		headToHead: HEAD_TO_HEAD,
		members: MEMBERS.map((m) => ({
			name: m.name,
			role: m.role,
			points: Math.round(m.pts * scale),
			you: m.you,
		})).sort((a, b) => b.points - a.points),
	};
};

// Modo Virada: disputa da minha equipe com a logo à frente no ranking da cidade.
export const useVirada = (): IUseViradaReturn => {
	const demoState = useStore((s) => s.viradaState);
	const query = useQuery({
		queryKey: DATA_KEYS.virada,
		queryFn: getVirada,
		enabled: !IS_PREVIEW,
	});

	if (IS_PREVIEW) return { virada: demoView(demoState), hasTeam: true, isLoading: false };
	const data = query.data ?? null;
	return {
		virada: data?.rival ? toViradaView(data) : null,
		hasTeam: Boolean(data),
		isLoading: query.isLoading,
	};
};

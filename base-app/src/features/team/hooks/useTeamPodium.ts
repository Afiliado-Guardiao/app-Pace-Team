import { useMemo, useState } from "react";

import { formatKm, ITeamMember } from "@/lib/pace";

import { IPodiumMetric } from "../constants";

interface IUseTeamPodiumReturn {
	metric: IPodiumMetric;
	setMetric: (metric: IPodiumMetric) => void;
	top: readonly ITeamMember[];
	valueOf: (member: ITeamMember) => string;
	// "Você está em 4º · faltam 12 pts para o bronze" (só fora do pódio)
	missing: { place: number; gap: string } | null;
}

const BRONZE = 2;

// Pódio semanal da equipe por pontos ou km (top 3 com medalhas).
export const useTeamPodium = (members: readonly ITeamMember[]): IUseTeamPodiumReturn => {
	const [metric, setMetric] = useState<IPodiumMetric>("Pontos");
	const isKm = metric === "Km";

	const ranked = useMemo(() => {
		const score = (m: ITeamMember): number => (isKm ? m.km : m.pts);
		return [...members].sort((a, b) => score(b) - score(a));
	}, [isKm, members]);

	const format = (value: number): string =>
		isKm ? `${formatKm(value, 1)} km` : `${String(value)} pts`;
	const score = (m: ITeamMember): number => (isKm ? m.km : m.pts);
	const myIndex = ranked.findIndex((m) => m.you);
	const me = ranked.at(myIndex);
	const bronze = ranked.at(BRONZE);
	const gap = me && bronze ? Math.round((score(bronze) - score(me)) * 10) / 10 : 0;

	return {
		metric,
		setMetric,
		top: ranked.slice(0, 3),
		valueOf: (m) => format(score(m)),
		missing: myIndex > BRONZE ? { place: myIndex + 1, gap: format(gap) } : null,
	};
};

import { useMemo } from "react";

import { IMapFriend } from "@/components/shared/RunMap";
import { ITeamRunView, useTeamRun } from "@/lib/data";
import { formatDistance, formatDurationText, formatPace } from "@/lib/pace";

// Uma linha do "Quem correu": foto, nome, distância, tempo e ritmo
export interface ITeamMateRow {
	key: string;
	name: string;
	isYou: boolean;
	photo: string | null;
	distance: string;
	time: string;
	pace: string;
	// Ainda correndo: números até agora
	isLive: boolean;
}

interface IUseTeamRunSourceReturn {
	// Corrida aberta pelo aviso ou pelo Histórico › Equipe (null = não é)
	run: ITeamRunView | null;
	// Foto de cada um no fim do percurso dele (quem tem percurso e foto)
	pins: IMapFriend[];
	// Cada um que correu junto (vazio se correu sozinho)
	people: ITeamMateRow[];
	isLoading: boolean;
}

type IPinSource = Pick<
	ITeamRunView,
	"name" | "isYou" | "km" | "seconds" | "avatarUrl" | "route"
> & {
	isLive?: boolean;
};

const YOU = "Você";
const paceOf = (who: IPinSource): string => formatPace(who.km > 0 ? who.seconds / who.km : 0);

const pinOf = (who: IPinSource): IMapFriend | null => {
	const end = who.route.at(-1);
	if (!end || !who.avatarUrl) return null;
	const name = who.isYou ? YOU : who.name;
	return {
		position: end,
		image: { uri: who.avatarUrl },
		label: `${name} · ${formatDistance(who.km)} · ${paceOf(who)}`,
	};
};

const rowOf = (who: IPinSource, i: number): ITeamMateRow => ({
	key: `${who.name}-${String(i)}`,
	name: who.isYou ? YOU : who.name,
	isYou: who.isYou,
	photo: who.avatarUrl,
	distance: formatDistance(who.km),
	time: formatDurationText(who.seconds),
	pace: paceOf(who),
	isLive: Boolean(who.isLive),
});

// Corrida da equipe: a do colega (aviso, Histórico) ou a minha com quem
// correu junto no mesmo horário
export const useTeamRunSource = (id: string | undefined): IUseTeamRunSourceReturn => {
	const { run, isLoading } = useTeamRun(id);
	const pins = useMemo(() => {
		if (!run) return [];
		return [run, ...run.mates].map(pinOf).filter((p): p is IMapFriend => p !== null);
	}, [run]);
	// Quem foi mais longe primeiro
	const people = useMemo(() => {
		if (!run || run.mates.length === 0) return [];
		return [run, ...run.mates].sort((a, b) => b.km - a.km).map(rowOf);
	}, [run]);
	return { run, pins, people, isLoading };
};

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
	// Foto de cada um no fim do percurso dele (sem percurso: na largada)
	pins: IMapFriend[];
	// Percurso de cada colega (o mapa desenha em branco, além do seu)
	trails: [number, number][][];
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

// Todo mundo aparece: no fim do percurso dele, ou na largada de quem tem
// percurso (andou pouco ou ficou sem GPS); sem foto, as iniciais
const pinOf = (who: IPinSource, start: [number, number] | undefined): IMapFriend | null => {
	const end = who.route.at(-1) ?? start;
	if (!end) return null;
	const name = who.isYou ? YOU : who.name;
	const status = who.isLive ? "correndo" : paceOf(who);
	return {
		id: `${who.name}-${who.isYou ? "you" : "mate"}`,
		position: end,
		image: who.avatarUrl ? { uri: who.avatarUrl } : undefined,
		name,
		label: `${name} · ${formatDistance(who.km)} · ${status}`,
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
		const all = [run, ...run.mates];
		const start = all.find((w) => w.route.length > 0)?.route[0];
		return all.map((w) => pinOf(w, start)).filter((p): p is IMapFriend => p !== null);
	}, [run]);
	const trails = useMemo(
		() => (run ? run.mates.map((m) => m.route).filter((r) => r.length > 0) : []),
		[run],
	);
	// Quem foi mais longe primeiro
	const people = useMemo(() => {
		if (!run || run.mates.length === 0) return [];
		return [run, ...run.mates].sort((a, b) => b.km - a.km).map(rowOf);
	}, [run]);
	return { run, pins, trails, people, isLoading };
};

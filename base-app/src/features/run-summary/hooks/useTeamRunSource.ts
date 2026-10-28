import { useMemo } from "react";

import { IMapFriend } from "@/components/shared/RunMap";
import { ITeamRunView, useTeamRun } from "@/lib/data";
import { formatDistance } from "@/lib/pace";

interface IUseTeamRunSourceReturn {
	// Corrida aberta pelo aviso ou pelo Histórico › Equipe (null = não é)
	run: ITeamRunView | null;
	// Foto de cada um no fim do percurso dele (quem tem percurso e foto)
	pins: IMapFriend[];
	isLoading: boolean;
}

type IPinSource = Pick<ITeamRunView, "name" | "isYou" | "km" | "avatarUrl" | "route">;

const pinOf = (who: IPinSource): IMapFriend | null => {
	const end = who.route.at(-1);
	if (!end || !who.avatarUrl) return null;
	return {
		position: end,
		image: { uri: who.avatarUrl },
		label: `${who.isYou ? "Você" : who.name} · ${formatDistance(who.km)}`,
	};
};

// Corrida da equipe: a do colega (aviso, Histórico) ou a minha com quem
// correu junto no mesmo horário
export const useTeamRunSource = (id: string | undefined): IUseTeamRunSourceReturn => {
	const { run, isLoading } = useTeamRun(id);
	const pins = useMemo(() => {
		if (!run) return [];
		return [run, ...run.mates].map(pinOf).filter((p): p is IMapFriend => p !== null);
	}, [run]);
	return { run, pins, isLoading };
};

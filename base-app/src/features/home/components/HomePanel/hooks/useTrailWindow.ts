import { useMemo } from "react";

import {
	depthScale,
	IMapWorld,
	IPlacedTeam,
	mapWorld,
	TRAIL_SPOTS,
} from "@/components/shared/RankingTrail";
import { IRankedTeam } from "@/lib/pace";

interface IUseTrailWindowReturn {
	world: IMapWorld;
	placed: IPlacedTeam[];
	myRank: number;
	// Quanto o mundo sobe para a sua equipe ficar na janela
	offsetY: number;
}

// Onde a sua equipe fica na janela (um pouco abaixo do meio: dá para ver
// quem está logo acima na trilha)
const MINE_AT = 0.45;
// Margem para os corredores que estão saindo pela borda da janela
const EDGE = 120;

// Recorte da Trilha até o Cume (a mesma do Ranking) em volta da sua equipe
export const useTrailWindow = (
	teams: readonly IRankedTeam[],
	size: { width: number; height: number },
): IUseTrailWindowReturn =>
	useMemo(() => {
		const world = mapWorld(size.width);
		const all: IPlacedTeam[] = teams.slice(0, TRAIL_SPOTS.length).map((team, i) => {
			const [fx, py] = TRAIL_SPOTS[i] ?? [0.5, 0];
			const y = world.toY(py);
			const above = i > 0 ? TRAIL_SPOTS[i - 1] : undefined;
			return {
				team,
				rank: i + 1,
				x: world.toX(fx),
				y,
				scale: depthScale(i + 1, y, world.height),
				faceRight: above ? above[0] > fx : false,
			};
		});
		const mine = all.find((p) => p.team.you) ?? all.at(0);
		const maxY = Math.max(0, world.height - size.height);
		const offsetY = Math.max(0, Math.min(maxY, (mine?.y ?? 0) - size.height * MINE_AT));
		const placed = all.filter((p) => p.y > offsetY - EDGE && p.y < offsetY + size.height + EDGE);
		return { world, placed, myRank: mine?.rank ?? 1, offsetY };
	}, [teams, size.width, size.height]);

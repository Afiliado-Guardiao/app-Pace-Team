import { useCallback, useEffect, useMemo, useState } from "react";
import { useWindowDimensions } from "react-native";

import { IRankedTeam } from "@/lib/pace";

import { depthScale, mapWorld, MORE_SPOT, TRAIL_SPOTS } from "../geometry";

import { useMapScroll } from "./useMapScroll";

export interface IPlacedTeam {
	team: IRankedTeam;
	rank: number;
	x: number;
	y: number;
	scale: number;
	// Olha para a direita (o próximo colocado acima está à direita)
	faceRight: boolean;
}

// Mapa do ranking: equipes na trilha, a sua selecionada no começo, tocar
// seleciona e centraliza. `dataKey` muda com escopo/categoria (repete a
// abertura).
export const useRankingMap = (o: { teams: readonly IRankedTeam[]; dataKey: string }) => {
	const { width, height: screenH } = useWindowDimensions();
	const world = useMemo(() => mapWorld(width), [width]);
	const myIndex = Math.max(
		0,
		o.teams.findIndex((t) => t.you),
	);
	const [selected, setSelected] = useState(myIndex);
	const scroll = useMapScroll({ maxY: Math.max(0, world.height - screenH), viewport: screenH });

	const placed = useMemo<IPlacedTeam[]>(
		() =>
			o.teams.slice(0, TRAIL_SPOTS.length).map((team, i) => {
				const [fx, py] = TRAIL_SPOTS.at(i) ?? MORE_SPOT;
				const y = world.toY(py);
				const above = i > 0 ? TRAIL_SPOTS.at(i - 1) : undefined;
				return {
					team,
					rank: i + 1,
					x: world.toX(fx),
					y,
					scale: depthScale(i + 1, y, world.height),
					faceRight: above ? above[0] > fx : false,
				};
			}),
		[o.teams, world],
	);
	const more = Math.max(0, o.teams.length - TRAIL_SPOTS.length);

	// Abre no cume e desliza até a sua equipe (repete ao trocar escopo/categoria)
	useEffect(() => {
		setSelected(myIndex);
		const mine = placed.at(myIndex);
		if (mine) scroll.openAt(mine.y);
		// eslint-disable-next-line react-hooks/exhaustive-deps -- só ao abrir/trocar os dados
	}, [o.dataKey, placed.length]);

	const select = useCallback(
		(i: number) => {
			setSelected(i);
			const p = placed.at(i);
			if (p) scroll.centerOn(p.y);
		},
		[placed, scroll],
	);

	return {
		world,
		placed,
		more,
		moreY: world.toY(MORE_SPOT[1]),
		moreX: world.toX(MORE_SPOT[0]),
		myIndex,
		selected: placed.at(selected) ? selected : myIndex,
		select,
		goTop: () => {
			select(0);
		},
		goMine: () => {
			select(myIndex);
		},
		scroll,
	};
};

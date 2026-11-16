import { useEffect, useMemo, useRef, useState } from "react";

import { ITeamGame, ITeamGamePlayer } from "@/lib/supabase";

import { useWheelSpin } from "./useWheelSpin";

interface IUseWheelSyncReturn {
	spin: ReturnType<typeof useWheelSpin>;
	isSpinning: boolean;
	// Último sorteio que já parou embaixo da seta
	hit: { challenge: number; slot: number } | null;
	latest: ITeamGamePlayer | null;
}

const latestOf = (game: ITeamGame | null): ITeamGamePlayer | null => {
	const done = (game?.players ?? []).filter((p) => p.assignedAt !== null && p.challenge !== null);
	return done.sort((a, b) => (b.assignedAt ?? "").localeCompare(a.assignedAt ?? ""))[0] ?? null;
};

// Liga os dados da roleta ao giro: cada sorteio novo (de quem chamou, aqui ou
// no celular de outra pessoa) gira os dois anéis até o nome e a casa sorteados
export const useWheelSync = (game: ITeamGame | null): IUseWheelSyncReturn => {
	const spin = useWheelSpin();
	const [isSpinning, setIsSpinning] = useState(false);
	const [hit, setHit] = useState<{ challenge: number; slot: number } | null>(null);
	const seen = useRef<{ game: string | null; key: string | null }>({ game: null, key: null });
	const latest = useMemo(() => latestOf(game), [game]);
	const players = game?.players.length ?? 0;
	const { land, place } = spin;

	useEffect(() => {
		if (!game) return;
		const key = latest ? `${latest.userId}:${latest.assignedAt ?? ""}` : "none";
		const to =
			latest?.challenge != null
				? { challenge: latest.challenge, slot: latest.slot, players }
				: null;
		// Primeira vez vendo essa roleta (abriu a tela no meio): só posiciona
		if (seen.current.game !== game.id) {
			seen.current = { game: game.id, key };
			if (to) place(to);
			setHit(to ? { challenge: to.challenge, slot: to.slot } : null);
			return;
		}
		if (seen.current.key === key || !to) return;
		seen.current.key = key;
		setHit(null);
		setIsSpinning(true);
		land(to, () => {
			setIsSpinning(false);
			setHit({ challenge: to.challenge, slot: to.slot });
		});
	}, [game, latest, players, land, place]);

	return { spin, isSpinning, hit, latest };
};

import { useEffect, useMemo, useRef, useState } from "react";

import { ITeamGame, ITeamGamePlayer } from "@/lib/supabase";

import { useWheelSpin } from "./useWheelSpin";

interface IUseWheelSyncReturn {
	spin: ReturnType<typeof useWheelSpin>;
	// Girando ou com um sorteio novo que ainda não parou embaixo da seta
	isSpinning: boolean;
	// Quem acabou de ser sorteado e ainda não pode aparecer (a roleta não parou)
	hiddenId: string | null;
	// Último sorteio que já parou embaixo da seta
	hit: { challenge: number; slot: number } | null;
	latest: ITeamGamePlayer | null;
}

const keyOf = (p: ITeamGamePlayer | null): string =>
	p ? `${p.userId}:${p.assignedAt ?? ""}` : "none";

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
	const [revealed, setRevealed] = useState<string | null>(null);
	const seen = useRef<{ game: string | null; key: string | null }>({ game: null, key: null });
	const latest = useMemo(() => latestOf(game), [game]);
	const players = game?.players.length ?? 0;
	const { land, place } = spin;

	useEffect(() => {
		if (!game) return;
		const key = keyOf(latest);
		const to =
			latest?.challenge != null
				? { challenge: latest.challenge, slot: latest.slot, players }
				: null;
		// Primeira vez vendo essa roleta (abriu a tela no meio): só posiciona
		if (seen.current.game !== game.id) {
			seen.current = { game: game.id, key };
			setRevealed(key);
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
			setRevealed(key);
			setHit({ challenge: to.challenge, slot: to.slot });
		});
	}, [game, latest, players, land, place]);

	// O resultado só aparece quando os anéis param: até lá, o sorteio novo fica
	// escondido (a resposta do servidor chega antes do fim do giro). Ao abrir a
	// tela no meio da roleta, o que já foi sorteado aparece direto.
	const isFirstSight = game !== null && seen.current.game !== game.id;
	const hiddenId = latest && !isFirstSight && keyOf(latest) !== revealed ? latest.userId : null;

	return { spin, isSpinning: isSpinning || hiddenId !== null, hiddenId, hit, latest };
};

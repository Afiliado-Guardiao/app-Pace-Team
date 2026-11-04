import { useEffect, useRef } from "react";

import { useQuery } from "@tanstack/react-query";

import {
	avatarUrlOf,
	clearLivePosition,
	getTeamLivePositions,
	ILivePosition,
	setLivePosition,
} from "@/lib/supabase";
import { IS_PREVIEW } from "@/constants/preview";

import { DATA_KEYS } from "./keys";

// Colega correndo agora, com a foto do perfil e quanto já correu
export interface ILiveMate {
	id: string;
	name: string;
	avatarUrl: string | null;
	position: readonly [number, number];
	meters: number;
}

interface IUseTeamLiveOptions {
	// Correndo com a equipe agora (sozinho, ninguém vê a posição)
	isActive: boolean;
	// Minha posição mais recente e quanto já corri
	me: readonly [number, number] | null;
	meters: number;
}

interface IUseTeamLiveReturn {
	mates: ILiveMate[];
	// Por onde passou quem vai na frente (vazio se eu sou o 1º)
	leaderTrail: readonly (readonly [number, number])[];
}

const SEND_MS = 5000;
const POLL_MS = 5000;
const ignore = (): undefined => undefined;

const toMate = (p: ILivePosition): ILiveMate => ({
	id: p.userId,
	name: p.name,
	avatarUrl: p.avatarPath ? avatarUrlOf(p.avatarPath) : null,
	position: [p.lat, p.lng],
	meters: p.meters ?? 0,
});

const NO_TRAIL: readonly (readonly [number, number])[] = [];

// O 1º colocado entre os colegas deixa o rastro; se eu estou na frente, não
const leaderTrailOf = (
	positions: readonly ILivePosition[],
	myMeters: number,
): readonly (readonly [number, number])[] => {
	const leader = positions.reduce<ILivePosition | null>(
		(best, p) => (best === null || (p.meters ?? 0) > (best.meters ?? 0) ? p : best),
		null,
	);
	if (!leader || (leader.meters ?? 0) <= myMeters) return NO_TRAIL;
	return leader.trail ?? NO_TRAIL;
};

// Correr junto: manda a minha posição (e quanto já corri) a cada 5 s e traz a
// dos colegas, com o rastro de quem vai na frente. Ao parar de correr com a
// equipe, a posição é apagada no servidor.
export const useTeamLive = ({ isActive, me, meters }: IUseTeamLiveOptions): IUseTeamLiveReturn => {
	const enabled = isActive && !IS_PREVIEW;
	// Sempre a posição mais nova; o envio sai no máximo a cada 5 s
	const latest = useRef(me);
	latest.current = me;
	const latestMeters = useRef(meters);
	latestMeters.current = meters;
	const hasPosition = me !== null;

	useEffect(() => {
		if (!enabled || !hasPosition) return undefined;
		const send = (): void => {
			const point = latest.current;
			if (point) setLivePosition(point[0], point[1], latestMeters.current).catch(ignore);
		};
		send();
		const timer = setInterval(send, SEND_MS);
		return () => {
			clearInterval(timer);
		};
	}, [enabled, hasPosition]);

	useEffect(() => {
		if (!enabled) return undefined;
		return () => {
			clearLivePosition().catch(ignore);
		};
	}, [enabled]);

	const query = useQuery({
		queryKey: DATA_KEYS.teamLivePositions,
		queryFn: getTeamLivePositions,
		enabled,
		refetchInterval: POLL_MS,
	});
	const data = enabled ? (query.data ?? []) : [];
	return { mates: data.map(toMate), leaderTrail: leaderTrailOf(data, meters) };
};

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

// Colega correndo agora, com a foto do perfil
export interface ILiveMate {
	id: string;
	name: string;
	avatarUrl: string | null;
	position: readonly [number, number];
}

interface IUseTeamLiveOptions {
	// Correndo com a equipe agora (sozinho, ninguém vê a posição)
	isActive: boolean;
	// Minha posição mais recente
	me: readonly [number, number] | null;
}

const SEND_MS = 5000;
const POLL_MS = 5000;
const ignore = (): undefined => undefined;

const toMate = (p: ILivePosition): ILiveMate => ({
	id: p.userId,
	name: p.name,
	avatarUrl: p.avatarPath ? avatarUrlOf(p.avatarPath) : null,
	position: [p.lat, p.lng],
});

// Correr junto: manda a minha posição a cada 5 s e traz a dos colegas. Ao
// parar de correr com a equipe, a posição é apagada no servidor.
export const useTeamLive = ({ isActive, me }: IUseTeamLiveOptions): ILiveMate[] => {
	const enabled = isActive && !IS_PREVIEW;
	// Sempre a posição mais nova; o envio sai no máximo a cada 5 s
	const latest = useRef(me);
	latest.current = me;
	const hasPosition = me !== null;

	useEffect(() => {
		if (!enabled || !hasPosition) return undefined;
		const send = (): void => {
			const point = latest.current;
			if (point) setLivePosition(point[0], point[1]).catch(ignore);
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
	return enabled ? (query.data ?? []).map(toMate) : [];
};

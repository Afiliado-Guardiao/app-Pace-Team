import { useEffect } from "react";
import { AppState } from "react-native";

import { useQueryClient } from "@tanstack/react-query";

import { DATA_KEYS } from "@/lib/data/keys";
import { getBuddyProfile, pingTeamOnline } from "@/lib/supabase";
import { IS_PREVIEW } from "@/constants/preview";

import { BUDDY_KEYS, buddyNative } from "./native";
import { registerPushToken } from "./notifications";
import { flushPendingRuns } from "./pendingRuns";
import { useBuddyStore } from "./store";

const ignore = (): undefined => undefined;
// Com o app aberto, avisa de novo que está online (a equipe vê online quem
// avisou nos últimos 15 min; o aviso no celular deles sai no máximo a cada 2 h)
const HEARTBEAT_MS = 5 * 60_000;
// Só avisa a equipe no celular depois de 5 min seguidos com o app aberto
// (quem só abre e fecha não dispara o aviso)
const NOTIFY_AFTER_MS = 5 * 60_000;

// Meta de km trocada no widget ou no atalho, fora do app
const adoptNativeKm = (): void => {
	const value = Number(buddyNative.get(BUDDY_KEYS.kmIdx));
	if (!Number.isInteger(value) || buddyNative.get(BUDDY_KEYS.kmIdx) === null) return;
	useBuddyStore.getState().setKmIdx(value);
	buddyNative.remove(BUDDY_KEYS.kmIdx);
};

// Toda vez que o app abre (ou volta para a frente): traz o que o Buddy fez
// fora dele (meta de km, corridas na fila, metas cumpridas) e avisa a equipe
// que você está online.
export const useBuddyAppEvents = (): void => {
	const client = useQueryClient();

	useEffect(() => {
		if (IS_PREVIEW) return undefined;
		let activeSince = Date.now();
		const sync = async (): Promise<void> => {
			adoptNativeKm();
			if ((await flushPendingRuns()) > 0) {
				await Promise.all(
					[DATA_KEYS.myRuns, DATA_KEYS.myStats, DATA_KEYS.myTeam, DATA_KEYS.rankingAll].map(
						(queryKey) => client.invalidateQueries({ queryKey }),
					),
				);
			}
			const profile = await getBuddyProfile();
			if (profile) useBuddyStore.getState().hydrate(profile);
			await pingTeamOnline(false);
			await client.invalidateQueries({ queryKey: DATA_KEYS.teamOnline });
		};
		const heartbeat = (): void => {
			if (AppState.currentState !== "active") return;
			pingTeamOnline(Date.now() - activeSince >= NOTIFY_AFTER_MS)
				.then(() => client.invalidateQueries({ queryKey: DATA_KEYS.teamOnline }))
				.catch(ignore);
		};
		sync().catch(ignore);
		registerPushToken().catch(ignore);
		const timer = setInterval(heartbeat, HEARTBEAT_MS);
		const subscription = AppState.addEventListener("change", (status) => {
			if (status !== "active") return;
			activeSince = Date.now();
			sync().catch(ignore);
		});
		return () => {
			clearInterval(timer);
			subscription.remove();
		};
	}, [client]);
};

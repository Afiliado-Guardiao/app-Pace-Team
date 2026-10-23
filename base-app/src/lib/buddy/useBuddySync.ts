import { useEffect, useMemo, useRef } from "react";

import { SUPABASE_ANON_KEY, SUPABASE_URL } from "@/lib/constants";
import { useMyRuns } from "@/lib/data";
import { AUTH_STORAGE_KEY } from "@/lib/supabase/client";
import { useStore } from "@/store";

import { BUDDY_KEYS, buddyNative } from "./native";
import { scheduleBuddyAlarm, scheduleSickReminder } from "./notifications";
import { buildSharedState } from "./sharedState";
import { useBuddyStore } from "./store";
import { useBuddyContext } from "./useBuddyContext";

const ignore = (): undefined => undefined;

// Tudo o que acontece no app muda o Buddy fora dele: grava o estado no App
// Group e recarrega o widget quando muda equipe, ranking, metas, cor,
// acessórios, despertador ou a última corrida. Também reagenda o aviso de
// "doente" e o despertador.
export const useBuddySync = (): void => {
	const user = useStore((s) => s.user);
	const ctx = useBuddyContext();
	const { saved } = useMyRuns();
	const goals = useBuddyStore((s) => s.goals);
	const equipped = useBuddyStore((s) => s.equipped);
	const color = useBuddyStore((s) => s.color);
	const lastFree = useBuddyStore((s) => s.lastFree);
	const kmIdx = useBuddyStore((s) => s.kmIdx);
	const alarm = useBuddyStore((s) => s.alarm);
	const lastSent = useRef("");
	const lastRun = saved.at(0);
	const lastRunAt = lastRun ? new Date(lastRun.startedAt).getTime() : null;
	const userName = user?.name ?? "";

	const state = useMemo(
		() =>
			buildSharedState({
				userName,
				ctx,
				goals,
				equipped,
				color,
				lastFree,
				kmIdx,
				lastRunAt,
				alarm,
			}),
		[userName, ctx, goals, equipped, color, lastFree, kmIdx, lastRunAt, alarm],
	);

	// Onde o atalho encontra o servidor e o login (mesmo login do app)
	useEffect(() => {
		buddyNative.set(
			BUDDY_KEYS.config,
			JSON.stringify({
				url: SUPABASE_URL,
				anonKey: SUPABASE_ANON_KEY,
				storageKey: AUTH_STORAGE_KEY,
			}),
		);
	}, []);

	useEffect(() => {
		const json = JSON.stringify(state);
		if (json === lastSent.current) return;
		lastSent.current = json;
		buddyNative.set(BUDDY_KEYS.state, json);
		buddyNative.reloadWidgets();
	}, [state]);

	useEffect(() => {
		scheduleSickReminder(state.sickAt).catch(ignore);
	}, [state.sickAt]);

	useEffect(() => {
		scheduleBuddyAlarm(alarm).catch(ignore);
	}, [alarm]);
};

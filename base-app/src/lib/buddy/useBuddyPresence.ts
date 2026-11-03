import { useEffect, useRef } from "react";
import { AppState } from "react-native";

import { IS_PREVIEW } from "@/constants/preview";

import { useBuddyLive } from "./liveStore";
import { buddyNative } from "./native";

// Mesmas chaves de BuddyAppPresence (targets/buddy-widget/_shared/BuddyPanelShared.swift)
const ACTIVE_KEY = "buddyAppActiveAt";
const PANEL_KEY = "buddyOpenPanelAt";
// Confere o pedido do cartão rápido (o Buddy aparece logo depois do toque)
const CHECK_MS = 400;
// "Estou aberto" a cada 2 s (o cartão considera o app fechado depois de 5 s)
const ACTIVE_EVERY = 5;

// Com o app aberto, o "Chamar Pace Buddy" (Toque Traseiro) abre o Buddy vivo
// do app em vez do cartão do sistema: o app avisa que está na tela e atende
// o pedido que o atalho deixa no App Group.
export const useBuddyPresence = (): void => {
	const handled = useRef(buddyNative.get(PANEL_KEY));

	useEffect(() => {
		if (IS_PREVIEW || !buddyNative.isAvailable) return undefined;
		let tick = 0;
		const markActive = (): void => {
			buddyNative.set(ACTIVE_KEY, String(Date.now()));
		};
		const check = (): void => {
			if (AppState.currentState !== "active") return;
			tick += 1;
			if (tick % ACTIVE_EVERY === 0) markActive();
			const request = buddyNative.get(PANEL_KEY);
			if (request && request !== handled.current) {
				handled.current = request;
				useBuddyLive.getState().openPanel();
			}
		};
		markActive();
		const timer = setInterval(check, CHECK_MS);
		const subscription = AppState.addEventListener("change", (status) => {
			if (status === "active") markActive();
			else buddyNative.remove(ACTIVE_KEY);
		});
		return () => {
			clearInterval(timer);
			subscription.remove();
			buddyNative.remove(ACTIVE_KEY);
		};
	}, []);
};

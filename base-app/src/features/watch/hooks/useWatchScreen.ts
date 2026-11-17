import { useState } from "react";

import { useRouter } from "expo-router";

import { IFloatingToastData, useFloatingToast } from "@/components/pace";
import { useWatchSync } from "@/lib/data";
import { askHealthAccess, isHealthAvailable, useWatchStore } from "@/lib/health";
import { IS_PREVIEW } from "@/constants/preview";

import { importedToast, WATCH_TOASTS } from "../constants";

const MONTHS = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
const MINUTE = 60_000;

// "17 de nov"
const dayLabel = (ms: number): string => {
	const d = new Date(ms);
	return `${String(d.getDate())} de ${MONTHS[d.getMonth()] ?? ""}`;
};

// "agora há pouco" / "há 12 min" / "17 de nov, 08:40"
const agoLabel = (ms: number, now: number): string => {
	const minutes = Math.round((now - ms) / MINUTE);
	if (minutes < 2) return "agora há pouco";
	if (minutes < 60) return `há ${String(minutes)} min`;
	const d = new Date(ms);
	const clock = `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
	return `${dayLabel(ms)}, ${clock}`;
};

interface IUseWatchScreenReturn {
	isConnected: boolean;
	isBusy: boolean;
	since: string;
	lastSync: string | null;
	importedCount: number;
	toast: IFloatingToastData | null;
	connect: () => void;
	syncNow: () => void;
	disconnect: () => void;
	goBack: () => void;
}

// Relógio e Apple Saúde: conectar (tela de permissão da Apple), buscar
// agora e desconectar. A busca automática roda na área logada.
export const useWatchScreen = (): IUseWatchScreenReturn => {
	const router = useRouter();
	const { toast, showToast } = useFloatingToast();
	const { syncNow } = useWatchSync();
	const connectedAt = useWatchStore((s) => s.connectedAt);
	const lastSyncAt = useWatchStore((s) => s.lastSyncAt);
	const importedCount = useWatchStore((s) => s.importedCount);
	const [isBusy, setIsBusy] = useState(false);

	const search = async (isQuietWhenEmpty: boolean): Promise<void> => {
		setIsBusy(true);
		const count = await syncNow();
		setIsBusy(false);
		if (count > 0) showToast(importedToast(count));
		else if (!isQuietWhenEmpty) showToast(WATCH_TOASTS.none);
	};

	const connect = (): void => {
		if (!IS_PREVIEW && !isHealthAvailable()) {
			showToast(WATCH_TOASTS.unavailable);
			return;
		}
		setIsBusy(true);
		void (async () => {
			// A Apple não conta se o atleta negou: seguimos e, se não vier
			// corrida, a tela mostra onde conferir a permissão
			if (!IS_PREVIEW) await askHealthAccess().catch(() => false);
			useWatchStore.getState().connect(Date.now());
			showToast(WATCH_TOASTS.connected);
			await search(true);
		})().finally(() => {
			setIsBusy(false);
		});
	};

	return {
		isConnected: connectedAt !== null,
		isBusy,
		since: connectedAt ? dayLabel(connectedAt) : "",
		lastSync: lastSyncAt ? agoLabel(lastSyncAt, Date.now()) : null,
		importedCount,
		toast,
		connect,
		syncNow: () => {
			void search(false);
		},
		disconnect: () => {
			useWatchStore.getState().disconnect();
		},
		goBack: () => {
			router.back();
		},
	};
};

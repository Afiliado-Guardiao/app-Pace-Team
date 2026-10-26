import { useCallback, useEffect, useState } from "react";
import { Linking } from "react-native";

import * as Location from "expo-location";

import { buddyNative } from "@/lib/buddy/native";

interface IUseShortcutGuideReturn {
	isAvailable: boolean;
	hasAlways: boolean;
	openShortcuts: () => void;
	allowAlways: () => void;
}

// Atalho do Toque Traseiro: abre o app Atalhos e libera a localização
// "Sempre" (o Buddy mede a corrida sem o app aberto).
export const useShortcutGuide = (): IUseShortcutGuideReturn => {
	const [hasAlways, setHasAlways] = useState(false);
	const isAvailable = buddyNative.isAvailable;

	const refresh = useCallback(() => {
		if (!isAvailable) return;
		Location.getBackgroundPermissionsAsync()
			.then((p) => {
				setHasAlways(p.granted);
			})
			.catch(() => undefined);
	}, [isAvailable]);

	useEffect(refresh, [refresh]);

	return {
		isAvailable,
		hasAlways,
		openShortcuts: () => {
			Linking.openURL("shortcuts://").catch(() => undefined);
		},
		allowAlways: () => {
			// O iOS só mostra o pedido de "Sempre" uma vez; depois disso (ou se a
			// localização foi negada) o único caminho é Ajustes › PACE TEAM.
			const ask = async (): Promise<void> => {
				const fg = await Location.requestForegroundPermissionsAsync();
				const bg = fg.granted ? await Location.requestBackgroundPermissionsAsync() : null;
				if (!bg?.granted) await Linking.openSettings();
				refresh();
			};
			ask().catch(() => undefined);
		},
	};
};

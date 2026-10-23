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
			const ask = async (): Promise<void> => {
				const fg = await Location.requestForegroundPermissionsAsync();
				if (!fg.granted) return;
				const bg = await Location.requestBackgroundPermissionsAsync();
				// Já negou antes: só dá para mudar em Ajustes
				if (!bg.granted && !bg.canAskAgain) await Linking.openSettings();
				refresh();
			};
			ask().catch(() => undefined);
		},
	};
};

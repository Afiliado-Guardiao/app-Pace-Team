import { useEffect, useState } from "react";
import { AppState, Linking, Platform } from "react-native";

import * as Notifications from "expo-notifications";

import { IS_PREVIEW } from "@/constants/preview";

interface IUseNotificationsOffReturn {
	// Notificações do PACE TEAM desligadas no iPhone (a equipe não chega)
	isOff: boolean;
	openSettings: () => void;
}

// Confere ao abrir e ao voltar para o app (a pessoa pode ter ligado em Ajustes)
export const useNotificationsOff = (): IUseNotificationsOffReturn => {
	const [isOff, setIsOff] = useState(false);

	useEffect(() => {
		if (IS_PREVIEW || Platform.OS === "web") return undefined;
		const check = (): void => {
			Notifications.getPermissionsAsync()
				.then((p) => {
					setIsOff(!p.granted);
				})
				.catch(() => undefined);
		};
		check();
		const subscription = AppState.addEventListener("change", (status) => {
			if (status === "active") check();
		});
		return () => {
			subscription.remove();
		};
	}, []);

	return {
		isOff,
		openSettings: () => {
			Linking.openSettings().catch(() => undefined);
		},
	};
};

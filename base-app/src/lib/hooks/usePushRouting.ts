import { useEffect } from "react";
import { Platform } from "react-native";

import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";

import { ROUTES } from "@/constants/routes";

interface IPushData {
	type?: string;
	runId?: string;
}

// Com o app aberto, a notificação também aparece no alto da tela
if (Platform.OS !== "web") {
	Notifications.setNotificationHandler({
		handleNotification: () =>
			Promise.resolve({
				shouldShowBanner: true,
				shouldShowList: true,
				shouldPlaySound: true,
				shouldSetBadge: false,
			}),
	});
}

// Tocar na notificação abre o lugar certo: "fulano concluiu uma corrida" abre
// a corrida dele; "sua equipe está correndo" abre Correr; "fulano está
// online" abre a aba Equipe.
export const usePushRouting = (): void => {
	const router = useRouter();

	useEffect(() => {
		if (Platform.OS === "web") return undefined;
		const open = (response: Notifications.NotificationResponse | null): void => {
			const data = response?.notification.request.content.data as IPushData | undefined;
			if (data?.type === "team_run" && data.runId) {
				router.push({ pathname: ROUTES.RUN_DETAIL, params: { teamRun: data.runId } });
			} else if (data?.type === "team_running") {
				router.navigate(ROUTES.RUN);
			} else if (data?.type === "team_online") {
				router.navigate(ROUTES.TEAM);
			}
		};
		// App aberto pela notificação (estava fechado)
		open(Notifications.getLastNotificationResponse());
		const subscription = Notifications.addNotificationResponseReceivedListener(open);
		return () => {
			subscription.remove();
		};
	}, [router]);
};

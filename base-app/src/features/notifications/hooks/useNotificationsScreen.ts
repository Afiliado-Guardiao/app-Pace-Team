import { useCallback, useState } from "react";

import { useRouter } from "expo-router";

import { IFloatingToastData, useFloatingToast } from "@/components/pace";
import { INotification, NOTIFICATIONS } from "@/lib/pace";
import { ROUTES } from "@/constants/routes";

import { NOTIFICATION_TOASTS } from "../constants";

interface IUseNotificationsScreenReturn {
	items: INotification[];
	unreadCount: number;
	isPrefsOpen: boolean;
	toast: IFloatingToastData | null;
	openItem: (item: INotification) => void;
	markAllRead: () => void;
	answerInvite: (item: INotification, accepted: boolean) => void;
	openPrefs: () => void;
	closePrefs: () => void;
	goBack: () => void;
}

// Lista de avisos: marcar lidas, abrir o Modo Virada e responder convites.
export const useNotificationsScreen = (): IUseNotificationsScreenReturn => {
	const router = useRouter();
	const { toast, showToast } = useFloatingToast();
	const [items, setItems] = useState<INotification[]>([...NOTIFICATIONS]);
	const [isPrefsOpen, setIsPrefsOpen] = useState(false);

	const markRead = useCallback((id: string) => {
		setItems((list) => list.map((n) => (n.id === id ? { ...n, unread: false } : n)));
	}, []);

	const openItem = useCallback(
		(item: INotification) => {
			markRead(item.id);
			if (item.link === "disputa") router.push(ROUTES.VIRADA);
		},
		[markRead, router],
	);

	const markAllRead = useCallback(() => {
		setItems((list) => list.map((n) => ({ ...n, unread: false })));
	}, []);

	const answerInvite = useCallback(
		(item: INotification, accepted: boolean) => {
			setItems((list) =>
				list.map((n) => (n.id === item.id ? { ...n, unread: false, invite: false } : n)),
			);
			showToast(accepted ? NOTIFICATION_TOASTS.accepted : NOTIFICATION_TOASTS.declined);
		},
		[showToast],
	);

	const goBack = useCallback(() => {
		if (router.canGoBack()) router.back();
		else router.replace(ROUTES.HOME);
	}, [router]);

	return {
		items,
		unreadCount: items.filter((n) => n.unread).length,
		isPrefsOpen,
		toast,
		openItem,
		markAllRead,
		answerInvite,
		openPrefs: () => {
			setIsPrefsOpen(true);
		},
		closePrefs: () => {
			setIsPrefsOpen(false);
		},
		goBack,
	};
};

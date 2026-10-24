import { useCallback, useMemo, useState } from "react";

import { useRouter } from "expo-router";

import { IFloatingToastData, useFloatingToast } from "@/components/pace";
import {
	INotificationEntry,
	teamErrorMessage,
	useNotificationFeed,
	useTeamActions,
} from "@/lib/data";
import { INotification } from "@/lib/pace";
import { IS_PREVIEW } from "@/constants/preview";
import { ROUTES } from "@/constants/routes";

import { NOTIFICATION_GROUPS, NOTIFICATION_TOASTS } from "../constants";

interface IUseNotificationsScreenReturn {
	items: INotification[];
	// Só os grupos ("Hoje", "Esta semana") que têm avisos
	groups: readonly string[];
	isEmpty: boolean;
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

// Para onde cada aviso leva ao tocar
const LINK_ROUTES: Record<NonNullable<INotification["link"]>, string> = {
	disputa: ROUTES.VIRADA,
	team: ROUTES.TEAM,
	challenges: ROUTES.CHALLENGES,
	ranking: ROUTES.RANKING,
};

// Lista de avisos: marcar lidas (no servidor), abrir o destino e responder convites.
export const useNotificationsScreen = (): IUseNotificationsScreenReturn => {
	const router = useRouter();
	const { toast, showToast } = useFloatingToast();
	const { items: feed, markRead: markOnServer } = useNotificationFeed();
	const { respond } = useTeamActions();
	// Leitura e respostas aparecem na hora, antes do servidor confirmar
	const [readIds, setReadIds] = useState<ReadonlySet<string>>(new Set());
	const [answered, setAnswered] = useState<ReadonlySet<string>>(new Set());
	const [isPrefsOpen, setIsPrefsOpen] = useState(false);

	const items = useMemo(
		() =>
			feed.map((n) => ({
				...n,
				unread: n.unread && !readIds.has(n.id),
				invite: n.invite && !answered.has(n.id),
			})),
		[feed, readIds, answered],
	);

	const markRead = useCallback(
		(entry: INotificationEntry | undefined, id: string) => {
			setReadIds((ids) => new Set([...ids, id]));
			if (entry?.isStored && entry.unread) markOnServer([id]);
		},
		[markOnServer],
	);

	const openItem = useCallback(
		(item: INotification) => {
			markRead(
				feed.find((n) => n.id === item.id),
				item.id,
			);
			if (item.link) router.push(LINK_ROUTES[item.link]);
		},
		[feed, markRead, router],
	);

	const markAllRead = useCallback(() => {
		setReadIds(new Set(feed.map((n) => n.id)));
		markOnServer(null);
	}, [feed, markOnServer]);

	const answerInvite = useCallback(
		(item: INotification, accepted: boolean) => {
			const entry = feed.find((n) => n.id === item.id);
			setAnswered((ids) => new Set([...ids, item.id]));
			markRead(entry, item.id);
			const done = accepted
				? {
						...NOTIFICATION_TOASTS.accepted,
						message: `${NOTIFICATION_TOASTS.acceptedPrefix}${entry?.teamName ?? ""}.`,
					}
				: NOTIFICATION_TOASTS.declined;
			if (IS_PREVIEW || !entry?.inviteId) {
				showToast(done);
				return;
			}
			respond.mutate(
				{ inviteId: entry.inviteId, accept: accepted },
				{
					onSuccess: () => {
						showToast(done);
					},
					onError: (error) => {
						showToast({ tone: "danger", title: teamErrorMessage(error) });
					},
				},
			);
		},
		[feed, markRead, respond, showToast],
	);

	const goBack = useCallback(() => {
		if (router.canGoBack()) router.back();
		else router.replace(ROUTES.HOME);
	}, [router]);

	return {
		items,
		groups: NOTIFICATION_GROUPS.filter((g) => items.some((n) => n.group === g)),
		isEmpty: items.length === 0,
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

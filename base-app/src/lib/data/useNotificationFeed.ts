import { useCallback, useMemo } from "react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { INotification, NOTIFICATIONS } from "@/lib/pace";
import { getNotifications, INotificationRow, markNotificationsRead } from "@/lib/supabase";
import { IS_PREVIEW } from "@/constants/preview";

import { DATA_KEYS } from "./keys";
import { useMyInvites } from "./useMyInvites";
import { useVirada } from "./useVirada";
import { IViradaView } from "./viradaView";

export interface INotificationEntry extends INotification {
	// Convite de equipe que o atleta ainda pode aceitar ou recusar
	inviteId?: string;
	teamName?: string;
	// Corrida do colega que o aviso abre
	runId?: string;
	// false = item calculado no app (disputa da semana), sem linha no servidor
	isStored: boolean;
}

interface IUseNotificationFeedReturn {
	items: INotificationEntry[];
	hasItems: boolean;
	unreadCount: number;
	// ids = null marca todos
	markRead: (ids: string[] | null) => void;
}

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

// "agora", "8 min", "2 h", "Ontem" ou o dia da semana
const timeLabel = (iso: string, now = new Date()): string => {
	const date = new Date(iso);
	const diff = now.getTime() - date.getTime();
	if (diff < MINUTE) return "agora";
	if (diff < HOUR) return `${String(Math.floor(diff / MINUTE))} min`;
	const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
	if (date.getTime() >= startOfToday) return `${String(Math.floor(diff / HOUR))} h`;
	if (date.getTime() >= startOfToday - 24 * HOUR) return "Ontem";
	return WEEKDAYS[date.getDay()] ?? "";
};

const isToday = (iso: string, now = new Date()): boolean =>
	new Date(iso).toDateString() === now.toDateString();

const toEntry = (
	row: INotificationRow,
	pendingInvites: ReadonlySet<string>,
): INotificationEntry => ({
	id: row.id,
	group: isToday(row.createdAt) ? "Hoje" : "Esta semana",
	icon: row.icon,
	tone: row.tone,
	title: row.title,
	sub: row.sub,
	time: timeLabel(row.createdAt),
	unread: !row.isRead,
	link: row.link ?? undefined,
	invite: row.kind === "invite" && pendingInvites.has(row.data.inviteId ?? ""),
	inviteId: row.data.inviteId,
	teamName: row.data.teamName,
	runId: row.data.runId,
	isStored: true,
});

// Disputa da semana: calculada na hora a partir do ranking (não fica salva).
const viradaItem = (virada: IViradaView): INotificationEntry => {
	const { scenario, rival, team } = virada;
	const isLeading = virada.state === "done";
	return {
		id: "virada",
		group: "Hoje",
		icon: isLeading ? "trophy" : "flame",
		tone: isLeading ? "success" : "accent",
		title: isLeading
			? `${team.name} lidera em ${team.city}`
			: `Modo Virada: faltam ${String(scenario.rival - scenario.us + 1)} pts`,
		sub: isLeading ? scenario.msg : `${rival.name} está logo à frente. Bora correr?`,
		time: "agora",
		unread: false,
		link: "disputa",
		isStored: false,
	};
};

const fetchFeed = async (): Promise<INotificationRow[]> => (IS_PREVIEW ? [] : getNotifications());

// Avisos do atleta: os do servidor (corridas, ranking, convites, desafios) e a disputa da semana.
export const useNotificationFeed = (): IUseNotificationFeedReturn => {
	const client = useQueryClient();
	const { invites } = useMyInvites();
	const { virada } = useVirada();
	const query = useQuery({ queryKey: DATA_KEYS.notifications, queryFn: fetchFeed });
	const mark = useMutation({
		mutationFn: markNotificationsRead,
		onSuccess: () => {
			void client.invalidateQueries({ queryKey: DATA_KEYS.notifications });
		},
	});

	const items = useMemo((): INotificationEntry[] => {
		if (IS_PREVIEW) return NOTIFICATIONS.map((n) => ({ ...n, isStored: false }));
		const pending = new Set(invites.map((i) => i.id));
		const stored = (query.data ?? []).map((row) => toEntry(row, pending));
		return [...(virada ? [viradaItem(virada)] : []), ...stored];
	}, [query.data, invites, virada]);

	const markRead = useCallback(
		(ids: string[] | null) => {
			if (IS_PREVIEW) return;
			mark.mutate(ids);
		},
		[mark],
	);

	return {
		items,
		hasItems: items.length > 0,
		unreadCount: items.filter((n) => n.unread).length,
		markRead,
	};
};

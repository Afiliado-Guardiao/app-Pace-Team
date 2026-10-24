import { useMemo } from "react";

import { INotification, NOTIFICATIONS } from "@/lib/pace";
import { IMyInvite } from "@/lib/supabase";
import { IS_PREVIEW } from "@/constants/preview";

import { useMyInvites } from "./useMyInvites";
import { useVirada } from "./useVirada";
import { IViradaView } from "./viradaView";

export interface INotificationEntry extends INotification {
	// Convite de equipe que o atleta pode aceitar ou recusar
	inviteId?: string;
	teamName?: string;
}

interface IUseNotificationFeedReturn {
	items: INotificationEntry[];
	hasItems: boolean;
}

const inviteItem = (invite: IMyInvite): INotificationEntry => {
	const left = Math.max(0, invite.size - invite.members);
	return {
		id: `invite-${invite.id}`,
		group: "Hoje",
		icon: "user-plus",
		tone: "accent",
		title: `${invite.teamName} convidou você`,
		sub: `${String(invite.size)} x ${String(invite.size)} · ${invite.city} · ${String(left)} vagas`,
		time: "",
		unread: true,
		invite: true,
		inviteId: invite.id,
		teamName: invite.teamName,
	};
};

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
		time: "",
		unread: true,
		link: "disputa",
	};
};

// Avisos do app a partir dos dados reais: convites pendentes e a disputa da semana.
export const useNotificationFeed = (): IUseNotificationFeedReturn => {
	const { invites } = useMyInvites();
	const { virada } = useVirada();

	const items = useMemo((): INotificationEntry[] => {
		if (IS_PREVIEW) return [...NOTIFICATIONS];
		return [...invites.map(inviteItem), ...(virada ? [viradaItem(virada)] : [])];
	}, [invites, virada]);

	return { items, hasItems: items.length > 0 };
};

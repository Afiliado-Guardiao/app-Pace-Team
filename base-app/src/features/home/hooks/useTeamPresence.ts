import { useMemo } from "react";

import { useMyTeam, useTeamOnline } from "@/lib/data";
import { ME } from "@/lib/pace";
import { useStore } from "@/store";
import { IS_PREVIEW } from "@/constants/preview";

export interface IPresencePerson {
	id: string;
	name: string;
	avatarUrl?: string;
	isOnline: boolean;
	isMe: boolean;
}

export interface ITeamPresence {
	// Online primeiro (eu na frente), depois quem está fora
	people: IPresencePerson[];
	onlineCount: number;
}

const MY_FALLBACK = IS_PREVIEW ? ME.name : "Atleta";
const norm = (s: string): string => s.trim().toLowerCase();

// Quem da equipe está online agora (o mesmo que põe um corredor na pista:
// eu, com o app aberto, e os colegas online) e quem não está, com foto e
// nome inteiro
export const useTeamPresence = (): ITeamPresence => {
	const user = useStore((state) => state.user);
	const { team } = useMyTeam();
	const { mates } = useTeamOnline();

	return useMemo(() => {
		const onlineNames = new Set(mates.map((m) => norm(m.name)));
		const myName = user?.name || MY_FALLBACK;
		const members = team?.members ?? [];
		const people: IPresencePerson[] = members.map((m, i) => ({
			id: m.id ?? `${m.name}-${String(i)}`,
			name: m.you ? myName : m.name,
			avatarUrl: (m.you ? user?.avatarUrl : m.avatarUrl) ?? undefined,
			isOnline: Boolean(m.you) || Boolean(m.isOnline) || onlineNames.has(norm(m.name)),
			isMe: Boolean(m.you),
		}));
		if (!people.some((p) => p.isMe)) {
			people.unshift({
				id: "me",
				name: myName,
				avatarUrl: user?.avatarUrl ?? undefined,
				isOnline: true,
				isMe: true,
			});
		}
		const rank = (p: IPresencePerson): number => (p.isMe ? 0 : p.isOnline ? 1 : 2);
		people.sort((a, b) => rank(a) - rank(b));
		return { people, onlineCount: people.filter((p) => p.isOnline).length };
	}, [team, mates, user]);
};

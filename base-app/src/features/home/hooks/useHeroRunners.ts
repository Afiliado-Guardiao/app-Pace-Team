import { useMemo } from "react";

import { useMyTeam, useTeamOnline } from "@/lib/data";

import { HOME_COPY } from "../constants";

export interface IHeroRunnerView {
	id: string;
	name: string;
	isMe: boolean;
}

export interface IHeroRunners {
	runners: IHeroRunnerView[];
	// "Só você online", "3 online", "Todos online"
	onlineText: string;
	hasMates: boolean;
}

const firstName = (name: string): string => name.trim().split(/\s+/)[0] || "Atleta";

// Um corredor na pista por integrante online: eu sempre primeiro (o app
// aberto já me deixa online), depois os colegas
export const useHeroRunners = (myName: string): IHeroRunners => {
	const { mates } = useTeamOnline();
	const { team } = useMyTeam();
	const memberCount = team?.members.length ?? 1;

	const runners = useMemo<IHeroRunnerView[]>(
		() => [
			{ id: "me", name: firstName(myName), isMe: true },
			...mates.map((m) => ({ id: m.id, name: firstName(m.name), isMe: false })),
		],
		[mates, myName],
	);

	const total = runners.length;
	let onlineText = `${String(total)} ${HOME_COPY.onlineSuffix}`;
	if (total === 1) onlineText = HOME_COPY.onlineOnlyYou;
	else if (memberCount > 1 && total >= memberCount) onlineText = HOME_COPY.onlineAll;

	return { runners, onlineText, hasMates: total > 1 };
};

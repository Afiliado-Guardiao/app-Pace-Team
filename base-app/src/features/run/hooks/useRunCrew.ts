import { ImageSourcePropType } from "react-native";

import { ITeamOnlineView, useMyTeam, useTeamOnline } from "@/lib/data";
import { IS_PREVIEW } from "@/constants/preview";

import { RUN_COPY } from "../constants";

export interface IMapFriend {
	image: ImageSourcePropType;
	label: string;
	position: readonly [number, number];
}

interface IUseRunCrewReturn {
	mates: ITeamOnlineView[];
	onlineTitle: string;
	onlineSub: string;
	hasOnline: boolean;
	subtitleSolo: string;
	friendsAround: (me: readonly [number, number]) => IMapFriend[];
}

// Posições de exemplo em volta de você (só na prévia: ainda não há posição ao vivo)
const FRIEND_OFFSETS: readonly [number, number][] = [
	[0.0006, -0.0016],
	[-0.0009, 0.0002],
	[0.0005, 0.0015],
];

// "Correr junto": colegas de equipe com o app aberto agora e o nome da equipe.
export const useRunCrew = (): IUseRunCrewReturn => {
	const { mates } = useTeamOnline();
	const { team } = useMyTeam();
	const count = mates.length;
	const hasOnline = count > 0;

	return {
		mates,
		hasOnline,
		onlineTitle: hasOnline ? `${String(count)}${RUN_COPY.onlineTitleSuffix}` : RUN_COPY.onlineNone,
		onlineSub: hasOnline ? RUN_COPY.onlineSub : RUN_COPY.onlineNoneSub,
		subtitleSolo: team ? `${RUN_COPY.subtitleSoloTeam}${team.name}.` : RUN_COPY.subtitleSoloNoTeam,
		friendsAround: (me) =>
			IS_PREVIEW
				? mates.flatMap((m, i) =>
						m.image
							? [
									{
										image: m.image,
										label: "online",
										position: [
											me[0] + (FRIEND_OFFSETS[i]?.[0] ?? 0),
											me[1] + (FRIEND_OFFSETS[i]?.[1] ?? 0),
										] as const,
									},
								]
							: [],
					)
				: [],
	};
};

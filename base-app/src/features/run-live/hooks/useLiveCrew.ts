import { ImageSourcePropType } from "react-native";

import { useTeamOnline } from "@/lib/data";
import { MEMBERS } from "@/lib/pace";
import { IS_PREVIEW } from "@/constants/preview";

import { RUN_LIVE_COPY } from "../constants";

interface ICrewPerson {
	name: string;
	src?: ImageSourcePropType;
}

interface IUseLiveCrewReturn {
	isVisible: boolean;
	// Fotos grandes do design (só na prévia, modo equipe)
	photos: ImageSourcePropType[];
	people: ICrewPerson[];
	extra?: number;
	text: string;
}

const DEMO_EXTRA = 2;

// Quem do time aparece na corrida ao vivo: colegas com o app aberto agora.
export const useLiveCrew = (isTeam: boolean): IUseLiveCrewReturn => {
	const { mates } = useTeamOnline();

	if (IS_PREVIEW) {
		return {
			isVisible: true,
			photos: isTeam ? mates.flatMap((m) => (m.image ? [m.image] : [])) : [],
			people: MEMBERS.slice(1, 4).map((m) => ({ name: m.name })),
			extra: DEMO_EXTRA,
			text: isTeam ? RUN_LIVE_COPY.teamRunning : RUN_LIVE_COPY.crewRunning,
		};
	}
	return {
		isVisible: mates.length > 0,
		photos: [],
		people: mates.map((m) => ({ name: m.name, src: m.image })),
		text: `${String(mates.length)}${RUN_LIVE_COPY.onlineNow}`,
	};
};

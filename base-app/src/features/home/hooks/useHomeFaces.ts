import { useTeamRuns, useVirada } from "@/lib/data";
import { formatKm, IViradaTone } from "@/lib/pace";

import { HOME_COPY } from "../constants";

export interface ITeamRunFaceData {
	km: string;
	sub: string;
}

export interface IViradaFaceData {
	label: string;
	sub: string;
	tone: IViradaTone;
	isDone: boolean;
	// "+" ou "−" e o valor absoluto (o CountUp anima só o número)
	sign: string;
	diff: string;
	move: string;
	progress: number;
}

interface IUseHomeFacesReturn {
	teamRun: ITeamRunFaceData;
	virada: IViradaFaceData;
}

// Dados dos dois cards da pilha do Início (corrida da equipe e Modo Virada).
export const useHomeFaces = (): IUseHomeFacesReturn => {
	const { view } = useTeamRuns();
	const { virada, hasTeam } = useVirada();

	const teamRunSub = view.hasRuns ? view.label : `${view.label} · ${HOME_COPY.lastRunNone}`;
	const emptyViradaSub = hasTeam ? HOME_COPY.viradaNoRival : HOME_COPY.viradaNoTeam;
	const gap = virada ? virada.scenario.us - virada.scenario.rival : 0;
	const sign = gap > 0 ? "+" : "−";

	return {
		teamRun: {
			km: formatKm(view.totalKm),
			sub: view.hasTeam ? teamRunSub : HOME_COPY.lastRunNoTeam,
		},
		virada: virada
			? {
					label: virada.scenario.label,
					sub: `${HOME_COPY.viradaSub}${virada.rival.name}`,
					tone: virada.scenario.tone,
					isDone: virada.state === "done",
					sign: gap === 0 ? "" : sign,
					diff: String(Math.abs(gap)),
					move: virada.move,
					progress: virada.scenario.progress,
				}
			: {
					label: HOME_COPY.viradaTitle,
					sub: emptyViradaSub,
					tone: "warning",
					isDone: false,
					sign: "",
					diff: "0",
					move: "–",
					progress: 0,
				},
	};
};

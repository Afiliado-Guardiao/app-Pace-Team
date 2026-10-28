import { ITeamRunMember, useTeamRuns } from "@/lib/data";
import { distanceParts, formatKm } from "@/lib/pace";

import { RUN_SUMMARY_COPY } from "../constants";

interface IUseGroupRunReturn {
	meta: string;
	ran: string;
	totalKm: string;
	totalPoints: string;
	maxKm: number;
	members: ITeamRunMember[];
	// Distância de cada um ("511 m" abaixo de 1 km), na ordem de members
	distances: { value: string; unit: string }[];
	// Fotos para a pilha de avatares (sem foto, as iniciais)
	people: { name: string; src?: string }[];
}

// Corrida da equipe: quem correu no último dia com corrida, total e pontos.
export const useGroupRun = (): IUseGroupRunReturn => {
	const { view } = useTeamRuns();
	return {
		meta: view.label,
		ran: `${String(view.ran)}${RUN_SUMMARY_COPY.groupRanOf}${String(view.size)}${RUN_SUMMARY_COPY.groupRanSuffix}`,
		totalKm: formatKm(view.totalKm),
		totalPoints: `+${String(view.totalPoints)}`,
		maxKm: Math.max(1, ...view.members.map((m) => m.km)),
		members: view.members,
		distances: view.members.map((m) => distanceParts(m.km)),
		people: view.members.map((m) => ({ name: m.name, src: m.avatarUrl ?? undefined })),
	};
};

import { IRunSaved, useRunStore } from "@/lib/run";

export interface ILastRunInput {
	id: string;
	startedAt: string | Date;
	seconds: number;
	km: number;
	route: readonly (readonly [number, number])[];
	mode?: string;
	status: IRunSaved["status"];
	points: number;
}

// Coloca uma corrida salva como "última corrida": Compartilhar e Postar
// montam a arte com ela (pop-up do Buddy, Detalhes de uma corrida antiga).
export const setLastRun = (run: ILastRunInput): void => {
	const startedAt = new Date(run.startedAt).getTime();
	useRunStore.setState({
		lastResult: {
			seconds: run.seconds,
			km: run.km,
			points: run.route.map(([lat, lng]) => ({ lat, lng, t: startedAt })),
			mode: run.mode === "team" ? "team" : "dist",
			finishedAt: startedAt + run.seconds * 1000,
			saved: { id: run.id, status: run.status, points: run.points },
		},
	});
};

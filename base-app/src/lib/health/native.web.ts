import { IHealthWorkout } from "./types";

// Prévia web: o app Saúde só existe no iPhone.
export const isHealthAvailable = (): boolean => false;

export const askHealthAccess = (): Promise<boolean> => Promise.resolve(false);

export const fetchRunningWorkouts = (_since: Date): Promise<IHealthWorkout[]> =>
	Promise.resolve([]);

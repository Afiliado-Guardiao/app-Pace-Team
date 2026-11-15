import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { IWeatherNow } from "@/lib/supabase";
import { IWeatherReading } from "@/lib/weather";

export type IWeatherRead = { now: IWeatherNow } | { met: IWeatherReading } | null;

// Última leitura boa do tempo, salva no aparelho: ao abrir o app o céu já
// aparece certo na hora, enquanto a leitura nova chega
interface IWeatherCache {
	read: IWeatherRead;
	at: number;
	save: (read: IWeatherRead) => void;
}

export const useWeatherCache = create<IWeatherCache>()(
	persist(
		(set) => ({
			read: null,
			at: 0,
			save: (read) => {
				if (read) set({ read, at: Date.now() });
			},
		}),
		{
			name: "@pace-team:weather",
			storage: createJSONStorage(() => AsyncStorage),
			partialize: (s) => ({ read: s.read, at: s.at }),
		},
	),
);

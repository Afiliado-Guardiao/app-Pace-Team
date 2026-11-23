import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { IProOfferSource } from "./constants";

interface IProOfferState {
	// Janela aberta agora e o recurso que a abriu
	source: IProOfferSource | null;
	// Dia (AAAA-MM-DD) em que a janela já apareceu ao sair de um recurso Pro
	exitShownOn: string | null;
	show: (source: IProOfferSource) => void;
	close: () => void;
	// Saiu de um recurso Pro sem assinar: lembra do plano no máximo 1 vez por dia
	showOnExit: (source: IProOfferSource) => void;
}

const today = (): string => new Date().toISOString().slice(0, 10);

// Janela do Team Pro: uma só para o app inteiro (montada no layout logado)
export const useProOfferStore = create<IProOfferState>()(
	persist(
		(set, get) => ({
			source: null,
			exitShownOn: null,
			show: (source) => {
				set({ source });
			},
			close: () => {
				set({ source: null });
			},
			showOnExit: (source) => {
				if (get().exitShownOn === today()) return;
				set({ source, exitShownOn: today() });
			},
		}),
		{
			name: "@pace-team:pro-offer",
			storage: createJSONStorage(() => AsyncStorage),
			partialize: (s) => ({ exitShownOn: s.exitShownOn }),
		},
	),
);

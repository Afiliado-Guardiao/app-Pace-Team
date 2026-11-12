import { create } from "zustand";

import { ITeamHandoff } from "@/lib/supabase";

// Resultado da passagem da equipe do onboarding, esperando o Início avisar
// ("sua equipe veio junto") ou perguntar ("ficar na X ou ir para a Y?").
interface ITeamHandoffState {
	pending: ITeamHandoff | null;
	setPending: (handoff: ITeamHandoff | null) => void;
}

export const useTeamHandoffStore = create<ITeamHandoffState>((set) => ({
	pending: null,
	setPending: (handoff) => {
		set({ pending: handoff });
	},
}));

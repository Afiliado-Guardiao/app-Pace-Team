import { create } from "zustand";

import { ITeamGame } from "@/lib/supabase";

// Resultado aberto agora (o pop-up sozinho ou o "Ver resultado" da roleta)
interface IGameResultState {
	game: ITeamGame | null;
	show: (game: ITeamGame) => void;
	close: () => void;
}

export const useGameResultStore = create<IGameResultState>()((set) => ({
	game: null,
	show: (game) => {
		set({ game });
	},
	close: () => {
		set({ game: null });
	},
}));

import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { HINT_TIMING, HINTS, IHintId } from "./constants";

interface IHintState {
	// Salvo no aparelho: dicas que já terminaram e quantas vezes cada uma apareceu
	done: Partial<Record<IHintId, true>>;
	shows: Partial<Record<IHintId, number>>;
	// Só na memória: botões com dica na tela agora e a dica que está aparecendo
	mounted: Partial<Record<IHintId, number>>;
	active: IHintId | null;
	mount: (id: IHintId) => void;
	unmount: (id: IHintId) => void;
	show: (id: IHintId) => void;
	hide: () => void;
	finish: (id: IHintId) => void;
}

export const useHintStore = create<IHintState>()(
	persist(
		(set, get) => ({
			done: {},
			shows: {},
			mounted: {},
			active: null,
			mount: (id) => {
				set((s) => ({ mounted: { ...s.mounted, [id]: (s.mounted[id] ?? 0) + 1 } }));
			},
			unmount: (id) => {
				set((s) => ({
					mounted: { ...s.mounted, [id]: Math.max(0, (s.mounted[id] ?? 0) - 1) },
					active: s.active === id ? null : s.active,
				}));
			},
			show: (id) => {
				const shows = (get().shows[id] ?? 0) + 1;
				// Dica sem toque (só informa) termina ao aparecer; a de toque, depois de várias
				const isOver = !HINTS[id].isTap || shows >= HINT_TIMING.maxShows;
				set((s) => ({
					active: id,
					shows: { ...s.shows, [id]: shows },
					done: isOver ? { ...s.done, [id]: true } : s.done,
				}));
			},
			hide: () => {
				set({ active: null });
			},
			// O atleta tocou no botão: a dica some e não volta
			finish: (id) => {
				set((s) => ({
					done: { ...s.done, [id]: true },
					active: s.active === id ? null : s.active,
				}));
			},
		}),
		{
			name: "@pace-team:hints",
			storage: createJSONStorage(() => AsyncStorage),
			partialize: (s) => ({ done: s.done, shows: s.shows }),
		},
	),
);

// Próxima dica: a de menor ordem entre as que estão na tela e não terminaram,
// começando depois da última que apareceu (para não repetir a mesma)
export const nextHint = (last: IHintId | null): IHintId | null => {
	const { mounted, done } = useHintStore.getState();
	const ready = (Object.keys(HINTS) as IHintId[])
		.filter((id) => (mounted[id] ?? 0) > 0 && !done[id])
		.sort((a, b) => HINTS[a].order - HINTS[b].order);
	if (ready.length === 0) return null;
	const after = last ? ready.filter((id) => HINTS[id].order > HINTS[last].order) : ready;
	return after.at(0) ?? ready.at(0) ?? null;
};

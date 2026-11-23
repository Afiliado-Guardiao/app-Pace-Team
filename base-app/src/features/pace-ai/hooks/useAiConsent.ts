import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { useStore } from "@/store";

interface IAiConsentState {
	// Atletas (id da conta) que já autorizaram neste aparelho
	accepted: Partial<Record<string, true>>;
	accept: (userId: string) => void;
}

// Regra 5.1.2(i) da Apple: antes de mandar dados para uma IA de outra empresa,
// o app explica o quê e para quem, e pede a permissão do atleta.
const useAiConsentStore = create<IAiConsentState>()(
	persist(
		(set) => ({
			accepted: {},
			accept: (userId) => {
				set((s) => ({ accepted: { ...s.accepted, [userId]: true } }));
			},
		}),
		{
			name: "@pace-team:ai-consent",
			storage: createJSONStorage(() => AsyncStorage),
			partialize: (s) => ({ accepted: s.accepted }),
		},
	),
);

interface IUseAiConsentReturn {
	hasConsent: boolean;
	accept: () => void;
}

export const useAiConsent = (): IUseAiConsentReturn => {
	const userId = useStore((s) => s.user?.id) ?? "";
	const hasConsent = useAiConsentStore((s) => s.accepted[userId] === true);
	const acceptFor = useAiConsentStore((s) => s.accept);
	return {
		hasConsent,
		accept: () => {
			acceptFor(userId);
		},
	};
};

import { useRouter } from "expo-router";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useBuddyStore } from "@/lib/buddy/store";

interface IUseBuddyScreenReturn {
	top: number;
	goalsLabel: string;
	goBack: () => void;
}

// Cabeçalho da tela "Seu Buddy" (aberta pelo Perfil).
export const useBuddyScreen = (): IUseBuddyScreenReturn => {
	const router = useRouter();
	const insets = useSafeAreaInsets();
	const goals = useBuddyStore((s) => s.goals);

	return {
		top: Math.max(insets.top, 47) + 11,
		goalsLabel: `${String(goals)}${goals === 1 ? " meta cumprida" : " metas cumpridas"}`,
		goBack: () => {
			router.back();
		},
	};
};

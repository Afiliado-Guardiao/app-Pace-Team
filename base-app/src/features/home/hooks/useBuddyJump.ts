import { useCallback, useEffect, useRef } from "react";

import { useRouter } from "expo-router";

import { SharedValue, useSharedValue, withSequence, withTiming } from "react-native-reanimated";

import { ROUTES } from "@/constants/routes";

const JUMP_MS = 600;
// Abre a página do Buddy no meio do pulinho (dá para ver ele pular)
const OPEN_AFTER_MS = 320;

interface IUseBuddyJumpReturn {
	jump: SharedValue<number>;
	onBuddyPress: () => void;
}

// Toque no Buddy de pelúcia: pulinho (sobe 8, amassa de leve, 600 ms) e abre
// a página do Buddy (nome, personalizar, despertador), como o botão do Perfil
export const useBuddyJump = (): IUseBuddyJumpReturn => {
	const router = useRouter();
	const jump = useSharedValue(0);
	const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(
		() => () => {
			if (timer.current) clearTimeout(timer.current);
		},
		[],
	);

	const onBuddyPress = useCallback(() => {
		jump.value = withSequence(withTiming(0, { duration: 0 }), withTiming(1, { duration: JUMP_MS }));
		if (timer.current) clearTimeout(timer.current);
		timer.current = setTimeout(() => {
			router.push(ROUTES.BUDDY);
		}, OPEN_AFTER_MS);
	}, [jump, router]);

	return { jump, onBuddyPress };
};

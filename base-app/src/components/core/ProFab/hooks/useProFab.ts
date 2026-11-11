import { useCallback, useState } from "react";

import { useRouter, useSegments } from "expo-router";

import { useAnimatedStyle, useSharedValue, withSpring, withTiming } from "react-native-reanimated";

import { useMyPro } from "@/lib/data";
import { ROUTES } from "@/constants/routes";

import { IProFeatureId } from "../constants";

interface IUseProFabReturn {
	// Na aba Correr o botão some (lá o destaque é o INICIAR)
	isHidden: boolean;
	isOpen: boolean;
	toggle: () => void;
	close: () => void;
	open: (id: IProFeatureId) => void;
	backdropStyle: ReturnType<typeof useAnimatedStyle>;
	fabStyle: ReturnType<typeof useAnimatedStyle>;
	itemStyles: ReturnType<typeof useAnimatedStyle>[];
}

const SPRING = { damping: 14, stiffness: 220, mass: 0.7 } as const;
const STAGGER = 0.18;
const RISE = 18;

// Botão laranja do Buddy: abre os 3 recursos Pro em leque, um por vez
export const useProFab = (): IUseProFabReturn => {
	const router = useRouter();
	const segments = useSegments();
	const { isPro } = useMyPro();
	const [isOpen, setIsOpen] = useState(false);
	const t = useSharedValue(0);

	const setOpen = useCallback(
		(next: boolean) => {
			setIsOpen(next);
			t.value = next ? withSpring(1, SPRING) : withTiming(0, { duration: 160 });
		},
		[t],
	);

	const item = (index: number) =>
		// eslint-disable-next-line react-hooks/rules-of-hooks -- quantidade fixa (3)
		useAnimatedStyle(() => {
			const k = Math.min(1, Math.max(0, (t.value - index * STAGGER) / (1 - 2 * STAGGER)));
			return {
				opacity: k,
				transform: [{ translateY: (1 - k) * RISE }, { scale: 0.85 + 0.15 * k }],
			};
		});
	const itemStyles = [item(2), item(1), item(0)];

	return {
		isHidden: segments.at(-1) === "run",
		isOpen,
		toggle: () => {
			setOpen(!isOpen);
		},
		close: () => {
			setOpen(false);
		},
		open: (id) => {
			setOpen(false);
			// Recurso pronto e liberado abre direto; senão, a apresentação
			if (isPro && id === "analytics") router.push(ROUTES.PRO_ANALYTICS);
			else if (isPro && id === "ai") router.push(ROUTES.PACE_AI);
			else router.push({ pathname: ROUTES.PRO_FEATURE, params: { id } });
		},
		backdropStyle: useAnimatedStyle(() => ({ opacity: Math.min(1, t.value) })),
		fabStyle: useAnimatedStyle(() => ({ transform: [{ rotate: `${String(t.value * -10)}deg` }] })),
		itemStyles,
	};
};

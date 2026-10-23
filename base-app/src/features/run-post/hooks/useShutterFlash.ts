import { useCallback } from "react";

import {
	Easing,
	useAnimatedStyle,
	useSharedValue,
	withSequence,
	withTiming,
} from "react-native-reanimated";

const FLASH_IN_MS = 40;
const FLASH_OUT_MS = 420;

interface IUseShutterFlashReturn {
	fire: () => void;
	style: ReturnType<typeof useAnimatedStyle>;
}

// Clarão branco do disparador (.pt-flash do design).
export const useShutterFlash = (): IUseShutterFlashReturn => {
	const opacity = useSharedValue(0);

	const fire = useCallback(() => {
		opacity.value = withSequence(
			withTiming(1, { duration: FLASH_IN_MS }),
			withTiming(0, { duration: FLASH_OUT_MS, easing: Easing.out(Easing.quad) }),
		);
	}, [opacity]);

	const style = useAnimatedStyle(() => ({ opacity: opacity.value }));

	return { fire, style };
};

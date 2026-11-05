import { useCallback } from "react";

import { SharedValue, useSharedValue, withSequence, withTiming } from "react-native-reanimated";

const JUMP_MS = 600;

interface IUseBuddyJumpReturn {
	jump: SharedValue<number>;
	onBuddyPress: () => void;
}

// Toque no Buddy de pelúcia: pulinho (sobe 8, amassa de leve, 600 ms)
export const useBuddyJump = (): IUseBuddyJumpReturn => {
	const jump = useSharedValue(0);
	const onBuddyPress = useCallback(() => {
		jump.value = withSequence(withTiming(0, { duration: 0 }), withTiming(1, { duration: JUMP_MS }));
	}, [jump]);
	return { jump, onBuddyPress };
};

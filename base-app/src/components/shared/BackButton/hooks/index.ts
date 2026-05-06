import { useCallback } from "react";

import * as Haptics from "expo-haptics";

import { IBackButtonProps } from "../types";

export const useBackButton = ({ onPress, disabled }: IBackButtonProps) => {
	const handlePress = useCallback(() => {
		if (disabled) {
			return;
		}
		void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
		onPress();
	}, [onPress, disabled]);

	return {
		handlePress,
	};
};

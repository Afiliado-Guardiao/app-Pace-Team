import { useCallback, useRef } from "react";

import * as Haptics from "expo-haptics";

import { normalizeReferralCode } from "@/lib/referral";

import { IActionButtonProps, IBackButtonProps, IInputStep } from "../types";

interface IUseInputStepProps {
	step: IInputStep;
	onChange: (value: string) => void;
}

interface IUseMultiSelectStepProps {
	value: string[];
	onChange: (value: string[]) => void;
}

export const useActionButton = ({
	onPress,
	disabled,
}: Pick<IActionButtonProps, "onPress" | "disabled">) => {
	const isProcessingRef = useRef(false);
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);

	const handlePress = useCallback(() => {
		if (disabled || isProcessingRef.current) {
			return;
		}

		isProcessingRef.current = true;

		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}

		timeoutRef.current = setTimeout(() => {
			isProcessingRef.current = false;
		}, 1000);

		void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
		onPress();
	}, [onPress, disabled]);

	return {
		handlePress,
	};
};

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


export const useInputStep = ({ step, onChange }: IUseInputStepProps) => {
	const handleChange = useCallback(
		(text: string) => {
			let transformedText = text;

			if (step.id === "email") {
				transformedText = text.toLowerCase().replace(/\s/g, "");
			}

			if (step.id === "referral") {
				transformedText = normalizeReferralCode(text);
				if (transformedText.length > 10) {
					transformedText = transformedText.substring(0, 10);
				}
			}

			onChange(transformedText);
		},
		[step.id, onChange],
	);

	return {
		handleChange,
	};
};

export const useMultiSelectStep = ({ value, onChange }: IUseMultiSelectStepProps) => {
	const handlePress = useCallback(
		(optionId: string) => {
			const isSelected = value.includes(optionId);
			if (isSelected) {
				onChange(value.filter((id) => id !== optionId));
			} else {
				onChange([...value, optionId]);
			}
		},
		[value, onChange],
	);

	return {
		handlePress,
	};
};

export { useAnimatedContent } from "./useAnimatedContent";
export { useAnimatedOption } from "./useAnimatedOption";
export { useAnimatedStepContainer } from "./useAnimatedStepContainer";
export { useBirthDatePickers } from "./useBirthDatePickers";
export * from "./useOnboardingNavigation";
export * from "./useOnboardingScreen";
export * from "./useOnboardingSync";
export { useOnboardingTracking } from "./useOnboardingTracking";
export { usePressAnimation } from "./usePressAnimation";
export { useWheelPickerStep } from "./useWheelPickerStep";

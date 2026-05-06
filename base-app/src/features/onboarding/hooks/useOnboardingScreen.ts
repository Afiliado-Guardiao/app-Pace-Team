import { useCallback, useMemo, useState } from "react";

import { useTranslation } from "react-i18next";

import { validateStep } from "../validation";

import { useOnboardingNavigation } from "./useOnboardingNavigation";
import { useOnboardingSync } from "./useOnboardingSync";
import { IStepConfig, useStepConfig } from "./useStepConfig";

interface IUseOnboardingScreenReturn {
	stepConfig: IStepConfig;
	progress: number;
	buttonText: string;
	isButtonDisabled: boolean;
	handleNext: () => Promise<void>;
	handleBack: () => void;
	footerHeight: number;
	setFooterHeight: (height: number) => void;
	needsScroll: boolean;
	animationDirection: "forward" | "backward";
	currentStepIndex: number;
	isSyncing: boolean;
	isSyncErrorVisible: boolean;
	handleRetrySync: () => Promise<boolean>;
}

export const useOnboardingScreen = (): IUseOnboardingScreenReturn => {
	const { t } = useTranslation("onboarding");

	const [footerHeight, setFooterHeight] = useState(0);

	const navigation = useOnboardingNavigation();
	const { isSyncing, isSyncErrorVisible, handleRetrySync } = useOnboardingSync({ navigation });

	const {
		currentStep,
		currentAnswer,
		isLastStep,
		animationDirection,
		currentStepIndex,
		progress,
		handleNext,
		handleBack,
		handleAnswerChange,
	} = navigation;

	const buttonText = useMemo(() => {
		if (isLastStep) {
			return t("navigation.finish");
		}

		if (currentStep.type === "transition") {
			return t("navigation.continue");
		}

		const isOptional = !("validation" in currentStep) || currentStep.validation?.required !== true;
		const hasAnswer =
			currentAnswer &&
			(Array.isArray(currentAnswer) ? currentAnswer.length > 0 : currentAnswer !== "");

		if (isOptional && !hasAnswer) {
			return t("navigation.skip");
		}

		return t("navigation.continue");
	}, [currentStep, currentAnswer, isLastStep, t]);

	const isButtonDisabled = useMemo(() => {
		if (isSyncing) {
			return true;
		}

		if (currentStep.type === "transition") {
			return false;
		}

		const isOptional = !("validation" in currentStep) || currentStep.validation?.required !== true;
		const hasAnswer =
			currentAnswer &&
			(Array.isArray(currentAnswer) ? currentAnswer.length > 0 : currentAnswer !== "");

		if (isOptional && !hasAnswer) {
			return false;
		}

		const validation = validateStep(currentStep, currentAnswer);
		return !validation.isValid;
	}, [currentStep, currentAnswer, isSyncing]);

	const validationError = useMemo(() => {
		if (!currentAnswer || currentStep.type === "transition") {
			return undefined;
		}

		const validation = validateStep(currentStep, currentAnswer);
		if (!validation.isValid && validation.errorKey) {
			return t(validation.errorKey, validation.errorParams);
		}

		return undefined;
	}, [currentStep, currentAnswer, t]);

	const { stepConfig } = useStepConfig({
		currentStep,
		currentAnswer,
		validationError,
		handleAnswerChange,
	});

	const needsScroll = useMemo(() => {
		if (stepConfig.type === "input") {
			return true;
		}

		return false;
	}, [stepConfig]);

	const handleFooterLayout = useCallback(
		(height: number) => {
			if (height !== footerHeight) {
				setFooterHeight(height);
			}
		},
		[footerHeight],
	);

	return {
		stepConfig,
		progress,
		buttonText,
		isButtonDisabled,
		handleNext,
		handleBack,
		footerHeight,
		setFooterHeight: handleFooterLayout,
		needsScroll,
		animationDirection,
		currentStepIndex,
		isSyncing,
		isSyncErrorVisible,
		handleRetrySync,
	};
};

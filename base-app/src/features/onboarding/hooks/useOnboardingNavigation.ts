import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useRouter } from "expo-router";

import { useStore } from "@/store";
import { ROUTES } from "@/constants/routes";
import { IDeviceMetadata } from "@/utils/device";

import { ONBOARDING_STEPS } from "../constants";
import { validateStep } from "../validation";

import { useOnboardingStepUpdater } from "./useOnboardingStepUpdater";
import { useOnboardingTracking } from "./useOnboardingTracking";

export interface IUseOnboardingNavigationReturn {
	currentStepIndex: number;
	animationDirection: "forward" | "backward";
	currentStep: (typeof ONBOARDING_STEPS)[number];
	currentAnswer: string | string[] | undefined;
	progress: number;
	isLastStep: boolean;
	handleNext: () => Promise<void>;
	handleBack: () => void;
	handleAnswerChange: (value: string | string[]) => void;
	deviceMetadataRef: React.RefObject<IDeviceMetadata | null>;
	performSyncRef: React.RefObject<(() => Promise<boolean>) | null>;
}

export const useOnboardingNavigation = (): IUseOnboardingNavigationReturn => {
	const router = useRouter();

	const [animationDirection, setAnimationDirection] = useState<"forward" | "backward">("forward");

	const currentStepIndex = useStore((state) => state.currentStepIndex);
	const answers = useStore((state) => state.answers);
	const setCurrentStepIndex = useStore((state) => state.setCurrentStepIndex);
	const setAnswer = useStore((state) => state.setAnswer);

	const previousStepIndexRef = useRef(currentStepIndex);
	const performSyncRef = useRef<(() => Promise<boolean>) | null>(null);

	useEffect(() => {
		if (currentStepIndex > previousStepIndexRef.current) {
			setAnimationDirection("forward");
		} else if (currentStepIndex < previousStepIndexRef.current) {
			setAnimationDirection("backward");
		}
		previousStepIndexRef.current = currentStepIndex;
	}, [currentStepIndex]);

	const currentStep = useMemo(() => ONBOARDING_STEPS[currentStepIndex], [currentStepIndex]);

	const { trackOnboardingStarted, trackStepCompleted } = useOnboardingTracking({
		currentStepIndex,
		currentStep,
		totalSteps: ONBOARDING_STEPS.length,
	});

	useEffect(() => {
		if (currentStepIndex === 0) {
			trackOnboardingStarted();
		}
	}, [currentStepIndex, trackOnboardingStarted]);

	const currentAnswer = useMemo(() => answers[currentStep.id], [answers, currentStep]);

	const progress = useMemo(
		() => ((currentStepIndex + 1) / ONBOARDING_STEPS.length) * 100,
		[currentStepIndex],
	);

	const isLastStep = currentStepIndex === ONBOARDING_STEPS.length - 1;

	const { getOrCreateOnboardingId, fireStepUpdate, deviceMetadataRef } = useOnboardingStepUpdater({
		currentStepIndex,
		currentStep,
		currentAnswer,
	});

	const handleNext = useCallback(async () => {
		const validation = validateStep(currentStep, currentAnswer);
		const isRequired = "validation" in currentStep && currentStep.validation?.required === true;

		if (!validation.isValid && isRequired) {
			return;
		}

		const resolvedId = await getOrCreateOnboardingId();

		if (isLastStep) {
			await performSyncRef.current?.();
			return;
		}

		// Offline-first: avança o step local mesmo se create-onboarding falhou.
		// O sync final tentará criar + consolidar respostas novamente.
		if (resolvedId) {
			fireStepUpdate(resolvedId, deviceMetadataRef.current);
		}
		trackStepCompleted();
		setCurrentStepIndex(currentStepIndex + 1);
	}, [
		currentStep,
		currentAnswer,
		isLastStep,
		currentStepIndex,
		getOrCreateOnboardingId,
		fireStepUpdate,
		deviceMetadataRef,
		trackStepCompleted,
		setCurrentStepIndex,
	]);

	const handleBack = useCallback(() => {
		if (currentStepIndex === 0) {
			router.replace(ROUTES.WELCOME);
		} else {
			setCurrentStepIndex(currentStepIndex - 1);
		}
	}, [currentStepIndex, setCurrentStepIndex, router]);

	const handleAnswerChange = useCallback(
		(value: string | string[]) => {
			const stringValue = Array.isArray(value) ? value.join(",") : value;
			setAnswer(currentStep.id, stringValue);
		},
		[currentStep, setAnswer],
	);

	return {
		currentStepIndex,
		animationDirection,
		currentStep,
		currentAnswer,
		progress,
		isLastStep,
		handleNext,
		handleBack,
		handleAnswerChange,
		deviceMetadataRef,
		performSyncRef,
	};
};

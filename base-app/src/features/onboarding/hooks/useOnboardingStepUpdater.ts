import { useCallback, useRef } from "react";

import { onboardingApi } from "@/lib/api/onboarding";
import { useStore } from "@/store";
import { getDeviceMetadata, IDeviceMetadata } from "@/utils/device";

import { ONBOARDING_STEPS } from "../constants";
import { parseAnswerForBackend } from "../utils/formatters";

interface IUseOnboardingStepUpdaterParams {
	currentStepIndex: number;
	currentStep: (typeof ONBOARDING_STEPS)[number];
	currentAnswer: string | string[] | undefined;
}

export interface IUseOnboardingStepUpdaterReturn {
	getOrCreateOnboardingId: () => Promise<string | null>;
	fireStepUpdate: (resolvedId: string, metadata: IDeviceMetadata | null) => void;
	deviceMetadataRef: React.RefObject<IDeviceMetadata | null>;
}

export const useOnboardingStepUpdater = ({
	currentStepIndex,
	currentStep,
	currentAnswer,
}: IUseOnboardingStepUpdaterParams): IUseOnboardingStepUpdaterReturn => {
	const onboardingId = useStore((state) => state.onboardingId);
	const setOnboardingId = useStore((state) => state.setOnboardingId);
	const getOrGenerateAnonymousUserId = useStore((state) => state.getOrGenerateAnonymousUserId);

	const deviceMetadataRef = useRef<IDeviceMetadata | null>(null);

	const getOrCreateOnboardingId = useCallback(async (): Promise<string | null> => {
		if (onboardingId) {
			return onboardingId;
		}
		try {
			const anonymousUserId = getOrGenerateAnonymousUserId();
			const response = await onboardingApi.createOnboarding(anonymousUserId);
			setOnboardingId(response.id);
			deviceMetadataRef.current = getDeviceMetadata();
			return response.id;
		} catch {
			return null;
		}
	}, [onboardingId, getOrGenerateAnonymousUserId, setOnboardingId]);

	const fireStepUpdate = useCallback(
		(resolvedId: string, metadata: IDeviceMetadata | null): void => {
			const deviceFields = {
				...(metadata?.deviceLanguage && { deviceLanguage: metadata.deviceLanguage }),
				...(metadata?.deviceRegion && { deviceRegion: metadata.deviceRegion }),
				...(metadata?.deviceTimezone && { deviceTimezone: metadata.deviceTimezone }),
			};

			if (currentStep.type !== "transition") {
				const formattedValue = parseAnswerForBackend(currentStep.id, currentAnswer);
				void onboardingApi
					.updateOnboarding(resolvedId, {
						[currentStep.id]: formattedValue,
						...deviceFields,
						currentStepIndex: currentStepIndex + 1,
					})
					.catch(() => {});
			} else {
				void onboardingApi
					.updateOnboarding(resolvedId, {
						...deviceFields,
						currentStepIndex: currentStepIndex + 1,
					})
					.catch(() => {});
			}
		},
		[currentStep, currentAnswer, currentStepIndex],
	);

	return { getOrCreateOnboardingId, fireStepUpdate, deviceMetadataRef };
};

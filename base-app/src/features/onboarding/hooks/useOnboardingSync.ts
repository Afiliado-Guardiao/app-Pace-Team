import { useCallback, useState } from "react";

import { useRouter } from "expo-router";

import { ISyncOnboardingPayload, onboardingApi } from "@/lib/api/onboarding";
import { useStore } from "@/store";
import { ROUTES } from "@/constants/routes";

import { useSyncErrorModal } from "../components/SyncErrorModal";
import { parseAnswerForBackend } from "../utils/formatters";

import type { IUseOnboardingNavigationReturn } from "./useOnboardingNavigation";
import { useOnboardingTracking } from "./useOnboardingTracking";

export interface IUseOnboardingSyncReturn {
	isSyncing: boolean;
	isSyncErrorVisible: boolean;
	performSync: () => Promise<boolean>;
	handleRetrySync: () => Promise<boolean>;
}

interface IUseOnboardingSyncProps {
	navigation: Pick<
		IUseOnboardingNavigationReturn,
		"currentStep" | "currentStepIndex" | "deviceMetadataRef" | "performSyncRef"
	>;
}

export const useOnboardingSync = ({ navigation }: IUseOnboardingSyncProps): IUseOnboardingSyncReturn => {
	const router = useRouter();

	const [isSyncing, setIsSyncing] = useState(false);

	const { isVisible: isSyncErrorVisible, showSyncError, hideSyncError } = useSyncErrorModal();

	const onboardingId = useStore((state) => state.onboardingId);
	const answers = useStore((state) => state.answers);
	const setCompleted = useStore((state) => state.setCompleted);

	const { trackOnboardingCompleted } = useOnboardingTracking({
		currentStepIndex: navigation.currentStepIndex,
		currentStep: navigation.currentStep,
		totalSteps: 0,
	});

	const buildSyncPayload = useCallback((): ISyncOnboardingPayload => {
		const metadata = navigation.deviceMetadataRef.current;

		const payload: ISyncOnboardingPayload = {
			...(metadata?.deviceLanguage && { deviceLanguage: metadata.deviceLanguage }),
			...(metadata?.deviceRegion && { deviceRegion: metadata.deviceRegion }),
			...(metadata?.deviceTimezone && { deviceTimezone: metadata.deviceTimezone }),
		};

		Object.keys(answers).forEach((stepId) => {
			const formattedValue = parseAnswerForBackend(stepId, answers[stepId]);
			if (formattedValue !== undefined) {
				(payload as Record<string, unknown>)[stepId] = formattedValue;
			}
		});

		return payload;
	}, [answers, navigation.deviceMetadataRef]);

	const performSync = useCallback(async (): Promise<boolean> => {
		if (!onboardingId) {
			return false;
		}

		setIsSyncing(true);
		hideSyncError();

		try {
			const syncPayload = buildSyncPayload();
			await onboardingApi.syncOnboarding(onboardingId, syncPayload);

			trackOnboardingCompleted();
			setCompleted(true);
			router.replace(ROUTES.AUTH);

			return true;
		} catch {
			showSyncError();
			return false;
		} finally {
			setIsSyncing(false);
		}
	}, [
		onboardingId,
		buildSyncPayload,
		trackOnboardingCompleted,
		setCompleted,
		router,
		showSyncError,
		hideSyncError,
	]);

	// Conecta performSync na ref de navegação pra que handleNext consiga chamar
	navigation.performSyncRef.current = performSync;

	return {
		isSyncing,
		isSyncErrorVisible,
		performSync,
		handleRetrySync: performSync,
	};
};

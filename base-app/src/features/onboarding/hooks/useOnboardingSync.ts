import { useCallback, useState } from "react";

import { useRouter } from "expo-router";

import { syncOnboarding } from "@/lib/supabase";
import { useStore } from "@/store";
import { ROUTES } from "@/constants/routes";

import { useSyncErrorModal } from "../components/SyncErrorModal";

import type { IUseOnboardingNavigationReturn } from "./useOnboardingNavigation";
import { useOnboardingTracking } from "./useOnboardingTracking";

export interface IUseOnboardingSyncReturn {
	isSyncing: boolean;
	isSyncErrorVisible: boolean;
	performSync: () => Promise<boolean>;
	handleRetrySync: () => Promise<boolean>;
}

interface IUseOnboardingSyncProps {
	navigation: Pick<IUseOnboardingNavigationReturn, "performSyncRef">;
}

export const useOnboardingSync = ({
	navigation,
}: IUseOnboardingSyncProps): IUseOnboardingSyncReturn => {
	const router = useRouter();

	const [isSyncing, setIsSyncing] = useState(false);

	const { isVisible: isSyncErrorVisible, showSyncError, hideSyncError } = useSyncErrorModal();

	const answers = useStore((state) => state.answers);
	const setCompleted = useStore((state) => state.setCompleted);

	const { trackOnboardingCompleted } = useOnboardingTracking();

	const performSync = useCallback(async (): Promise<boolean> => {
		setIsSyncing(true);
		hideSyncError();

		try {
			// Grava no Supabase apenas os campos persistidos do onboarding.
			await syncOnboarding({
				name: answers.name ?? null,
				email: answers.email ?? null,
				birthday: answers.birthday ?? null,
				completed: true,
			});

			void trackOnboardingCompleted();
			setCompleted(true);
			router.replace(ROUTES.AUTH);

			return true;
		} catch {
			showSyncError();
			return false;
		} finally {
			setIsSyncing(false);
		}
	}, [answers, trackOnboardingCompleted, setCompleted, router, showSyncError, hideSyncError]);

	// Conecta performSync na ref de navegação pra que handleNext consiga chamar.
	navigation.performSyncRef.current = performSync;

	return {
		isSyncing,
		isSyncErrorVisible,
		performSync,
		handleRetrySync: performSync,
	};
};

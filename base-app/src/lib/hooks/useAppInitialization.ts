import { useCallback, useEffect, useState } from "react";

import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import {
	Inter_400Regular,
	Inter_500Medium,
	Inter_600SemiBold,
	Inter_700Bold,
} from "@expo-google-fonts/inter";

import { useStore } from "@/store";
import { initializeI18n } from "@/i18n";

import { setupInterceptors } from "../api";

void SplashScreen.preventAutoHideAsync();

export const useAppInitialization = (): {
	isReady: boolean;
	error: Error | null;
	onLayoutRootView: () => void;
} => {
	const [isReady, setIsReady] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	const getOrGenerateAnonymousUserId = useStore((state) => state.getOrGenerateAnonymousUserId);
	const hasHydrated = useStore((state) => state._hasHydrated);

	const [fontsLoaded, fontError] = useFonts({
		Inter_400Regular,
		Inter_500Medium,
		Inter_600SemiBold,
		Inter_700Bold,
	});

	useEffect(() => {
		const initialize = async (): Promise<void> => {
			try {
				getOrGenerateAnonymousUserId();
				await initializeI18n();
				setupInterceptors();
			} catch (err) {
				setError(err as Error);
			}
		};

		void initialize();
	}, [getOrGenerateAnonymousUserId]);

	useEffect(() => {
		if ((fontsLoaded || fontError) && hasHydrated && !error) {
			setIsReady(true);
		}
	}, [fontsLoaded, fontError, hasHydrated, error]);

	const onLayoutRootView = useCallback(() => {
		if (isReady) {
			void SplashScreen.hideAsync();
		}
	}, [isReady]);

	return { isReady, error: error || fontError, onLayoutRootView };
};

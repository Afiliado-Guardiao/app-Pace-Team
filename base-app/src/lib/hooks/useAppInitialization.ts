import { useCallback, useEffect, useState } from "react";

import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import {
	Inter_400Regular,
	Inter_500Medium,
	Inter_600SemiBold,
	Inter_700Bold,
} from "@expo-google-fonts/inter";

import { ensureSession, onAuthChange, syncAuthState } from "@/lib/supabase";
import { useStore } from "@/store";
import { initializeI18n } from "@/i18n";

void SplashScreen.preventAutoHideAsync();

export const useAppInitialization = (): {
	isReady: boolean;
	error: Error | null;
	onLayoutRootView: () => void;
} => {
	const [isReady, setIsReady] = useState(false);
	const [isInitialized, setIsInitialized] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	const hasHydrated = useStore((state) => state._hasHydrated);

	const [fontsLoaded, fontError] = useFonts({
		Inter_400Regular,
		Inter_500Medium,
		Inter_600SemiBold,
		Inter_700Bold,
	});

	useEffect(() => {
		// Mantém o store sincronizado com a sessão do Supabase (login/logout).
		const subscription = onAuthChange(() => {
			void syncAuthState();
		});

		const initialize = async (): Promise<void> => {
			try {
				await initializeI18n();
				// Garante uma sessão anônima para o onboarding pré-cadastro.
				await ensureSession();
				await syncAuthState();
			} catch (err) {
				setError(err as Error);
			} finally {
				setIsInitialized(true);
			}
		};

		void initialize();

		return () => {
			subscription.unsubscribe();
		};
	}, []);

	useEffect(() => {
		if ((fontsLoaded || fontError) && hasHydrated && isInitialized && !error) {
			setIsReady(true);
		}
	}, [fontsLoaded, fontError, hasHydrated, isInitialized, error]);

	const onLayoutRootView = useCallback(() => {
		if (isReady) {
			void SplashScreen.hideAsync();
		}
	}, [isReady]);

	return { isReady, error: error || fontError, onLayoutRootView };
};

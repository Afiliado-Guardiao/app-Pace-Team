import { useCallback, useEffect, useState } from "react";

import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import {
	Inter_400Regular,
	Inter_500Medium,
	Inter_600SemiBold,
	Inter_700Bold,
} from "@expo-google-fonts/inter";

import { paceFontAssets } from "@/theme/pace/fonts";
import { ensureSession, onAuthChange, syncAuthState } from "@/lib/supabase";
import { useStore } from "@/store";
import { initializeI18n } from "@/i18n";
import { IS_PREVIEW } from "@/constants/preview";

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
	const hasApp = useStore((state) => state.isAuthenticated || state.isCompleted);

	const [fontsLoaded, fontError] = useFonts({
		Inter_400Regular,
		Inter_500Medium,
		Inter_600SemiBold,
		Inter_700Bold,
		// Montserrat + Exo 2 do design system PACE TEAM
		...paceFontAssets,
	});

	useEffect(() => {
		// Mantém o store sincronizado com a sessão do Supabase (login/logout).
		const subscription = onAuthChange(() => {
			void syncAuthState();
		});

		const initialize = async (): Promise<void> => {
			try {
				await initializeI18n();
				// Prévia por link: sem servidor (o link bloqueia chamadas externas)
				if (IS_PREVIEW) return;
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
		// Quem já tem o app: a BootSplash esconde quando a foto dela estiver pronta
		if (isReady && !hasApp) {
			void SplashScreen.hideAsync();
		}
	}, [isReady, hasApp]);

	// Na prévia, fonte que não carregar cai na do sistema em vez de travar o app
	return { isReady, error: error || (IS_PREVIEW ? null : fontError), onLayoutRootView };
};

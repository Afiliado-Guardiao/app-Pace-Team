import React from "react";

import { SuperwallProvider } from "expo-superwall";

import { type PaywalloInitConfig, PaywalloProvider } from "@virex-tech/paywallo-sdk";
import { initialWindowMetrics, SafeAreaProvider } from "react-native-safe-area-context";

import { ErrorBoundary } from "@/components/core/ErrorBoundary";
import { ModalProvider } from "@/components/ui/Modal";
import { ThemeProvider } from "@/theme";
import { PaywalloAuthBridge } from "@/lib/paywallo";
import { QueryProvider } from "@/lib/react-query";
import { SuperwallAuthBridge } from "@/lib/superwall";

interface IAppProvidersProps {
	children: React.ReactNode;
}

// Modelo híbrido (igual ao exemplo OzemPro):
// - Paywallo: identidade/tracking, funil de onboarding e fonte de verdade de
//   assinatura (o `paywallo-webhook` no backend). Provider mais externo.
// - Superwall: apresentação do paywall e gate de feature (`useSubscriptionGate`).
const PAYWALLO_APP_KEY = process.env.EXPO_PUBLIC_PAYWALLO_APP_KEY ?? "";

const paywalloConfig: PaywalloInitConfig = {
	appKey: PAYWALLO_APP_KEY,
	debug: __DEV__,
	onError: (error: unknown): void => {
		if (__DEV__) return;
		// TODO: forward to Sentry / error monitoring when integrated.
		// Example: Sentry.captureException(error, { tags: { source: "paywallo-sdk" } });
		void error;
	},
};

const SUPERWALL_API_KEYS = {
	ios: process.env.EXPO_PUBLIC_SUPERWALL_IOS_API_KEY ?? "",
	android: process.env.EXPO_PUBLIC_SUPERWALL_ANDROID_API_KEY ?? "",
};

export const AppProviders: React.FC<IAppProvidersProps> = ({ children }) => {
	return (
		<ErrorBoundary>
			<PaywalloProvider config={paywalloConfig}>
				<SuperwallProvider apiKeys={SUPERWALL_API_KEYS}>
					<PaywalloAuthBridge>
						<SuperwallAuthBridge>
							<ThemeProvider>
								<QueryProvider>
									<SafeAreaProvider initialMetrics={initialWindowMetrics}>
										<ModalProvider>{children}</ModalProvider>
									</SafeAreaProvider>
								</QueryProvider>
							</ThemeProvider>
						</SuperwallAuthBridge>
					</PaywalloAuthBridge>
				</SuperwallProvider>
			</PaywalloProvider>
		</ErrorBoundary>
	);
};

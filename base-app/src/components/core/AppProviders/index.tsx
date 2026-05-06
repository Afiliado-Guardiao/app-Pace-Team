import React from "react";

import { type PaywalloInitConfig, PaywalloProvider } from "@virex-tech/paywallo-sdk";
import { initialWindowMetrics, SafeAreaProvider } from "react-native-safe-area-context";

import { ErrorBoundary } from "@/components/core/ErrorBoundary";
import { ModalProvider } from "@/components/ui/Modal";
import { ThemeProvider } from "@/theme";
import { PaywalloAuthBridge } from "@/lib/paywallo";
import { QueryProvider } from "@/lib/react-query";

interface IAppProvidersProps {
	children: React.ReactNode;
}

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

export const AppProviders: React.FC<IAppProvidersProps> = ({ children }) => {
	return (
		<ErrorBoundary>
			<PaywalloProvider config={paywalloConfig}>
				<PaywalloAuthBridge>
					<ThemeProvider>
						<QueryProvider>
							<SafeAreaProvider initialMetrics={initialWindowMetrics}>
								<ModalProvider>{children}</ModalProvider>
							</SafeAreaProvider>
						</QueryProvider>
					</ThemeProvider>
				</PaywalloAuthBridge>
			</PaywalloProvider>
		</ErrorBoundary>
	);
};

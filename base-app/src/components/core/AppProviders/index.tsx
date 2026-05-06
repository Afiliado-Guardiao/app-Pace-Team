import React from "react";

import { initialWindowMetrics, SafeAreaProvider } from "react-native-safe-area-context";

import { ErrorBoundary } from "@/components/core/ErrorBoundary";
import { ModalProvider } from "@/components/ui/Modal";
import { ThemeProvider } from "@/theme";
import { QueryProvider } from "@/lib/react-query";

interface IAppProvidersProps {
	children: React.ReactNode;
}

export const AppProviders: React.FC<IAppProvidersProps> = ({ children }) => {
	return (
		<ErrorBoundary>
			<ThemeProvider>
				<QueryProvider>
					<SafeAreaProvider initialMetrics={initialWindowMetrics}>
						<ModalProvider>{children}</ModalProvider>
					</SafeAreaProvider>
				</QueryProvider>
			</ThemeProvider>
		</ErrorBoundary>
	);
};

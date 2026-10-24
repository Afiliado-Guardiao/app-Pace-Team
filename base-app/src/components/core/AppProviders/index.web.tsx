import React from "react";

import { initialWindowMetrics, SafeAreaProvider } from "react-native-safe-area-context";

import { ErrorBoundary } from "@/components/core/ErrorBoundary";
import { ModalProvider } from "@/components/ui/Modal";
import { ThemeProvider } from "@/theme";
import { QueryProvider } from "@/lib/react-query";

interface IAppProvidersProps {
	children: React.ReactNode;
}

// Versão web (só a prévia do app no navegador): o RevenueCat é nativo
// (StoreKit) e fica de fora — na prévia tudo abre liberado. O app no iPhone
// usa o index.tsx com o PurchasesBridge.
export const AppProviders: React.FC<IAppProvidersProps> = ({ children }) => (
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

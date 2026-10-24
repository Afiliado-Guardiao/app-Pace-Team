import React from "react";

import { initialWindowMetrics, SafeAreaProvider } from "react-native-safe-area-context";

import { ErrorBoundary } from "@/components/core/ErrorBoundary";
import { ModalProvider } from "@/components/ui/Modal";
import { ThemeProvider } from "@/theme";
import { PurchasesBridge } from "@/lib/purchases";
import { QueryProvider } from "@/lib/react-query";

interface IAppProvidersProps {
	children: React.ReactNode;
}

// Provedores do app no iPhone. A assinatura é do RevenueCat (StoreKit 2): o
// PurchasesBridge liga as compras ao atleta logado; o status chega às telas
// por useSubscription e o Supabase recebe uma cópia pelo revenuecat-webhook.
export const AppProviders: React.FC<IAppProvidersProps> = ({ children }) => {
	return (
		<ErrorBoundary>
			<ThemeProvider>
				<QueryProvider>
					<PurchasesBridge>
						<SafeAreaProvider initialMetrics={initialWindowMetrics}>
							<ModalProvider>{children}</ModalProvider>
						</SafeAreaProvider>
					</PurchasesBridge>
				</QueryProvider>
			</ThemeProvider>
		</ErrorBoundary>
	);
};

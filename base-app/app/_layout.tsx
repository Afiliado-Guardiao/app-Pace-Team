// Registra a tarefa de GPS da corrida (precisa existir antes de qualquer tela)
import "@/lib/run/locationTask";

import { View } from "react-native";

import { Slot } from "expo-router";

import { KeyboardProvider } from "react-native-keyboard-controller";

import { AppProviders } from "@/components/core/AppProviders";
import { ErrorBoundary } from "@/components/core/ErrorBoundary";
import { useAppInitialization } from "@/lib/hooks/useAppInitialization";

const rootStyle = { flex: 1 };

export default function RootLayout() {
	const { isReady, error, onLayoutRootView } = useAppInitialization();

	if (error) {
		throw error;
	}

	if (!isReady) {
		return null;
	}

	return (
		<View style={rootStyle} onLayout={onLayoutRootView}>
			<ErrorBoundary>
				<AppProviders>
					<KeyboardProvider>
						<Slot />
					</KeyboardProvider>
				</AppProviders>
			</ErrorBoundary>
		</View>
	);
}

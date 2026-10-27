import { Stack } from "expo-router";

import { useTheme } from "@/theme";
import { useBuddyBridge } from "@/lib/buddy";
import { useAuthGuard } from "@/lib/hooks/useAuthGuard";
import { usePaywallGate } from "@/lib/purchases";
import { useGpsWarmup } from "@/lib/run";

// Área logada: abas com trilho lateral + telas internas empilhadas por cima.
// O Pace Buddy vive fora do app (atalho e widget do iPhone); aqui o app só
// mantém o estado dele em dia. Sem assinatura ativa, abre a tela de assinatura.
export default function AuthLayout() {
	const { theme } = useTheme();
	const { shouldRender } = useAuthGuard();
	useBuddyBridge();
	useGpsWarmup();
	usePaywallGate();

	if (!shouldRender) return null;

	return (
		<Stack
			screenOptions={{
				headerShown: false,
				animation: "fade_from_bottom",
				contentStyle: { backgroundColor: theme.pace.colors.bgApp },
			}}
		>
			<Stack.Screen name="(tabs)" options={{ animation: "fade" }} />
			<Stack.Screen name="run-live" options={{ gestureEnabled: false, animation: "fade" }} />
			<Stack.Screen name="paywall" options={{ gestureEnabled: false, animation: "fade" }} />
		</Stack>
	);
}

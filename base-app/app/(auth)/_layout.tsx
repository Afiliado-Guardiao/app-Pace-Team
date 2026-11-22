import { Stack } from "expo-router";

import { BuddyFlight, BuddyLivePanel } from "@/components/buddy";
import { TeamGameInvite } from "@/components/core/TeamGameInvite";
import { PrizeLayer } from "@/components/shared/PrizeLayer";
import { useTheme } from "@/theme";
import { useBuddyBridge, useBuddyPresence } from "@/lib/buddy";
import { useWatchSync } from "@/lib/data";
import { useAuthGuard } from "@/lib/hooks/useAuthGuard";
import { usePushRouting } from "@/lib/hooks/usePushRouting";
import { useGpsWarmup } from "@/lib/run";

// Área logada: abas com trilho lateral + telas internas empilhadas por cima.
// O Pace Buddy vive fora do app (atalho e widget do iPhone); aqui o app
// mantém o estado dele em dia e, com o app aberto, mostra o Buddy vivo quando
// o atleta chama pelo Toque Traseiro. O app é grátis; o PACE TEAM PRO é opcional.
export default function AuthLayout() {
	const { theme } = useTheme();
	const { shouldRender } = useAuthGuard();
	useBuddyBridge();
	useBuddyPresence();
	useGpsWarmup();
	usePushRouting();
	// Relógio conectado: corridas do app Saúde entram sozinhas
	useWatchSync(true);

	if (!shouldRender) return null;

	return (
		<>
			<Stack
				screenOptions={{
					headerShown: false,
					animation: "fade_from_bottom",
					contentStyle: { backgroundColor: theme.pace.colors.bgApp },
				}}
			>
				<Stack.Screen name="(tabs)" options={{ animation: "fade" }} />
				<Stack.Screen name="run-live" options={{ gestureEnabled: false, animation: "fade" }} />
			</Stack>
			<BuddyLivePanel />
			<BuddyFlight />
			<PrizeLayer />
			{/* Convite da roleta da equipe: o seu desafio, em qualquer tela */}
			<TeamGameInvite />
		</>
	);
}

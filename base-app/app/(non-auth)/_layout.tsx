import { Stack } from "expo-router";

import { useTheme } from "@/theme";

// Primeira vez: onboarding (vitrine → perfil → Buddy → objetivo → equipe →
// Team Pro → pronto) na conta provisória; depois a abertura de sempre
// (vídeo → apresentação → boas-vindas com Apple ou e-mail) e o Início.
export default function NonAuthLayout() {
	const { theme } = useTheme();

	return (
		<Stack
			initialRouteName="splash"
			screenOptions={{
				headerShown: false,
				animation: "fade",
				contentStyle: { backgroundColor: theme.pace.colors.bgApp },
			}}
		>
			<Stack.Screen name="splash" options={{ gestureEnabled: false }} />
			<Stack.Screen name="showcase" options={{ gestureEnabled: false }} />
			<Stack.Screen name="setup" options={{ gestureEnabled: false }} />
			<Stack.Screen name="setup-team" />
			<Stack.Screen name="onboarding" options={{ gestureEnabled: false }} />
			<Stack.Screen name="welcome" options={{ gestureEnabled: false }} />
			<Stack.Screen name="login" />
			<Stack.Screen name="signup" />
		</Stack>
	);
}

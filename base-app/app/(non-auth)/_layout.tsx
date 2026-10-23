import { Stack } from "expo-router";

import { useTheme } from "@/theme";

// Entrada: abertura → apresentação → boas-vindas → login / cadastro.
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
			<Stack.Screen name="onboarding" options={{ gestureEnabled: false }} />
			<Stack.Screen name="welcome" options={{ gestureEnabled: false }} />
			<Stack.Screen name="login" />
			<Stack.Screen name="signup" />
		</Stack>
	);
}

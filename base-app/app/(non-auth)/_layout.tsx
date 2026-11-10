import { Stack } from "expo-router";

import { useTheme } from "@/theme";

// Entrada: abertura → vitrine (o app no celular) → apresentação → boas-vindas
// (Apple ou e-mail) → cadastro. Depois da conta, o onboarding (/setup).
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
			<Stack.Screen name="onboarding" options={{ gestureEnabled: false }} />
			<Stack.Screen name="welcome" options={{ gestureEnabled: false }} />
			<Stack.Screen name="login" />
			<Stack.Screen name="signup" />
		</Stack>
	);
}

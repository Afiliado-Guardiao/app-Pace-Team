import { Stack } from "expo-router";

import { useNavigationPersistence } from "@/lib/hooks/useNavigationPersistence";

export default function NonAuthLayout() {
	useNavigationPersistence();

	return (
		<Stack
			screenOptions={{
				headerShown: false,
				gestureEnabled: false,
			}}
			initialRouteName="welcome"
		/>
	);
}

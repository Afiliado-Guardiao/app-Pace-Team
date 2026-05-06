import { Stack } from "expo-router";

import { useAuthGuard } from "@/features/auth/hooks/useAuthGuard";

export default function AuthLayout() {
	const { shouldRender } = useAuthGuard();

	if (!shouldRender) {
		return null;
	}

	return (
		<Stack
			screenOptions={{
				headerShown: false,
				gestureEnabled: false,
			}}
		/>
	);
}

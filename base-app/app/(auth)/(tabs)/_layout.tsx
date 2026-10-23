import { Tabs } from "expo-router";

import { PaceTabRail } from "@/components/core/PaceTabRail";

// As 5 abas do PACE TEAM. A barra é o trilho de vidro vertical à direita.
export default function TabsLayout() {
	return (
		<Tabs
			screenOptions={{ headerShown: false, animation: "fade" }}
			tabBar={({ state, navigation }) => (
				<PaceTabRail
					active={state.routes[state.index]?.name ?? "home"}
					onChange={(tabId) => {
						navigation.navigate(tabId);
					}}
				/>
			)}
		>
			<Tabs.Screen name="home" />
			<Tabs.Screen name="run" />
			<Tabs.Screen name="ranking" />
			<Tabs.Screen name="team" />
			<Tabs.Screen name="profile" />
		</Tabs>
	);
}

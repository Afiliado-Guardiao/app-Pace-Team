import { Tabs } from "expo-router";

import { PaceTabRail } from "@/components/core/PaceTabRail";
import { RunReviewPopup } from "@/features/run-review";

// As 5 abas do PACE TEAM. A barra é o trilho de vidro vertical à direita.
// Por cima delas, o aviso da corrida feita com o Buddy (quando houver).
export default function TabsLayout() {
	return (
		<>
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
			<RunReviewPopup />
		</>
	);
}

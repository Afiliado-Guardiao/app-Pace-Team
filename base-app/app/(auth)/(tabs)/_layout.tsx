import { GestureResponderEvent, View, ViewStyle } from "react-native";

import { Tabs } from "expo-router";

import { PaceTabRail } from "@/components/core/PaceTabRail";
import { RunReviewPopup } from "@/features/run-review";
import { useBuddyLive } from "@/lib/buddy/liveStore";

// As 5 abas do PACE TEAM. A barra é o trilho de vidro vertical à direita.
// Por cima delas, o aviso da corrida feita com o Buddy (quando houver).
// Anota onde o dedo toca (sem pegar o toque): o Buddy das telas olha para lá
const watchTouch = (event: GestureResponderEvent): boolean => {
	useBuddyLive.getState().setTouch(event.nativeEvent.pageX, event.nativeEvent.pageY);
	return false;
};

const ROOT: ViewStyle = { flex: 1 };

export default function TabsLayout() {
	return (
		<View
			style={ROOT}
			onStartShouldSetResponderCapture={watchTouch}
			onMoveShouldSetResponderCapture={watchTouch}
		>
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
		</View>
	);
}

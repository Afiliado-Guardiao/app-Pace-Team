import { Tabs } from "expo-router";

import { HouseIcon, UserCircleIcon } from "phosphor-react-native";
import { useTranslation } from "react-i18next";

import { CustomTabBarButton } from "@/components/shared";
import { useTheme } from "@/theme";

export default function TabsLayout() {
	const { theme } = useTheme();
	const { t } = useTranslation("common");

	const { tabBar } = theme.componentSizes;

	return (
		<Tabs
			screenOptions={{
				headerShown: false,
				tabBarActiveTintColor: theme.colors.text,
				tabBarInactiveTintColor: theme.colors.textMuted,
				tabBarShowLabel: true,
				tabBarStyle: {
					backgroundColor: theme.colors.background,
					borderTopColor: theme.colors.border,
					borderTopWidth: theme.borderWidth.hairline,
					height: tabBar.height,
				},
				tabBarIconStyle: {
					marginVertical: 0,
				},
			}}
		>
			<Tabs.Screen
				name="home"
				options={{
					title: t("tabs.home"),
					tabBarIcon: ({ color, focused }) => (
						<HouseIcon size={tabBar.iconSize} color={color} weight={focused ? "fill" : "regular"} />
					),
					tabBarButton: (props) => (
						<CustomTabBarButton {...props} testID="tab-home" accessibilityLabel={t("tabs.home")} />
					),
				}}
			/>
			<Tabs.Screen
				name="profile"
				options={{
					title: t("tabs.profile"),
					tabBarIcon: ({ color, focused }) => (
						<UserCircleIcon
							size={tabBar.iconSize}
							color={color}
							weight={focused ? "fill" : "regular"}
						/>
					),
					tabBarButton: (props) => (
						<CustomTabBarButton
							{...props}
							testID="tab-profile"
							accessibilityLabel={t("tabs.profile")}
						/>
					),
				}}
			/>
		</Tabs>
	);
}

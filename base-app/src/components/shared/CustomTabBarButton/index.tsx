import React from "react";
import { Pressable, View } from "react-native";

import { useTheme } from "@/theme";

import { getTabBarButtonStyle } from "./styles";
import { ICustomTabBarButtonProps } from "./types";

export const CustomTabBarButton: React.FC<ICustomTabBarButtonProps> = ({
	children,
	style,
	...props
}) => {
	const { theme } = useTheme();

	return (
		<Pressable
			testID="tab-bar-button"
			accessibilityLabel="Tab bar button"
			{...props}
			style={(state) => {
				const baseStyle = typeof style === "function" ? style(state) : style;
				const customStyle = getTabBarButtonStyle(theme, state.pressed);
				return [baseStyle, customStyle];
			}}
		>
			<View pointerEvents="none">{children}</View>
		</Pressable>
	);
};

export * from "./types";

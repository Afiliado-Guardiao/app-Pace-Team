import React from "react";
import { View } from "react-native";

import { DEFAULT_TAB_SIZE, PACE_TABS } from "./constants";
import { SideRail } from "./SideRail";
import { createTabBarStyles } from "./styles";
import { TabButton } from "./TabButton";
import { ITabBarProps } from "./types";

// Navegação por abas. vertical = trilho lateral do app; horizontal = barra de círculos.
export const TabBar: React.FC<ITabBarProps> = ({
	items = PACE_TABS,
	active = "home",
	accentId = null,
	onChange,
	showLabels = false,
	size = DEFAULT_TAB_SIZE,
	orientation = "horizontal",
	style,
}) => {
	const styles = createTabBarStyles();

	if (orientation === "vertical") {
		return (
			<View style={style}>
				<SideRail items={items} active={active} size={size} onChange={onChange} />
			</View>
		);
	}

	return (
		<View style={[styles.root, style]} accessibilityRole="tablist">
			{items.map((item) => (
				<TabButton
					key={item.id}
					item={item}
					size={size}
					isActive={item.id === active}
					isAccent={item.id === accentId && item.id !== active}
					showLabel={showLabels}
					onChange={onChange}
				/>
			))}
		</View>
	);
};

export { PACE_TABS } from "./constants";
export * from "./types";

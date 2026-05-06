import React, { memo } from "react";
import { Pressable, Text, View } from "react-native";

import { CaretRightIcon } from "phosphor-react-native";

import { useTheme } from "@/theme";

import { createMenuItemStyles } from "./styles";
import { IMenuItemProps } from "./types";

const MenuItemComponent: React.FC<IMenuItemProps> = ({
	icon: Icon,
	label,
	onPress,
	value,
	showChevron = true,
	style,
	testID,
	accessibilityLabel,
}) => {
	const { theme } = useTheme();
	const styles = createMenuItemStyles(theme);

	return (
		<Pressable
			testID={testID}
			accessibilityLabel={accessibilityLabel ?? label}
			onPress={onPress}
			style={[styles.container, style]}
		>
			{({ pressed }) => (
				<View style={[styles.content, pressed && styles.contentPressed]}>
					<View style={styles.iconContainer}>
						<Icon size={20} color={theme.colors.background} weight="regular" />
					</View>
					<Text style={styles.label}>{label}</Text>
					{value !== undefined && (
						<Text style={styles.value} numberOfLines={1}>
							{value}
						</Text>
					)}
					{showChevron && (
						<CaretRightIcon size={20} color={theme.colors.textSecondary} weight="regular" />
					)}
				</View>
			)}
		</Pressable>
	);
};

export const MenuItem = memo(MenuItemComponent);

export * from "./types";

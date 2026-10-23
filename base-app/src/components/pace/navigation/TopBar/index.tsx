import React from "react";
import { Text, View } from "react-native";

import { useTheme } from "@/theme";

import { IconButton } from "../../core/IconButton";
import { GlassSurface } from "../../primitives";

import { createTopBarStyles } from "./styles";
import { ITopBarProps } from "./types";

// Barra do topo: voltar · título em pílula de vidro · ação à direita.
export const TopBar: React.FC<ITopBarProps> = ({
	title,
	onBack,
	leftIcon = "arrow-left",
	right,
	style,
}) => {
	const { theme } = useTheme();
	const styles = createTopBarStyles(theme);

	return (
		<View style={[styles.root, style]}>
			{onBack ? (
				<IconButton icon={leftIcon} label="Voltar" onPress={onBack} testID="pace-topbar-back" />
			) : (
				<View style={styles.spacer} />
			)}
			{title ? (
				<GlassSurface
					appearance={styles.titleAppearance}
					radius={theme.pace.radii.pill}
					style={styles.titlePill}
				>
					{typeof title === "string" ? (
						<Text style={styles.titleText} numberOfLines={1} accessibilityRole="header">
							{title}
						</Text>
					) : (
						title
					)}
				</GlassSurface>
			) : (
				<View />
			)}
			{right ? (
				<IconButton
					icon={right.icon}
					label={right.label}
					badge={right.badge}
					onPress={right.onPress}
					testID="pace-topbar-right"
				/>
			) : (
				<View style={styles.spacer} />
			)}
		</View>
	);
};

export * from "./types";

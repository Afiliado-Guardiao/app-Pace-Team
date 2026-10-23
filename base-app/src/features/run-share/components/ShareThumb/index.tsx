import React from "react";
import { Pressable, Text, View } from "react-native";

import { ITheme, useTheme } from "@/theme";

interface IShareThumbProps {
	label: string;
	isSelected: boolean;
	onPress: () => void;
	children: React.ReactNode;
	testID?: string;
}

export const THUMB = { width: 58, height: 103 } as const;

const createShareThumbStyles = (theme: ITheme, isSelected: boolean) => {
	const { colors, typography } = theme.pace;
	return {
		root: { alignItems: "center" as const, gap: 6 },
		box: {
			width: THUMB.width,
			height: THUMB.height,
			borderRadius: 12,
			overflow: "hidden" as const,
			borderWidth: isSelected ? 2 : 1,
			borderColor: isSelected ? colors.orange[500] : colors.cameraThumbBorder,
			boxShadow: isSelected ? "0 6px 18px -6px rgba(253,90,12,.8)" : "none",
		},
		label: {
			fontFamily: typography.fonts.bold,
			fontSize: typography.sizes.xs,
			color: isSelected ? colors.textPrimary : colors.textSecondary,
		},
	};
};

// Miniatura vertical (modelo ou fundo) com o nome embaixo.
export const ShareThumb: React.FC<IShareThumbProps> = ({
	label,
	isSelected,
	onPress,
	children,
	testID,
}) => {
	const { theme } = useTheme();
	const styles = createShareThumbStyles(theme, isSelected);

	return (
		<Pressable
			style={styles.root}
			onPress={onPress}
			accessibilityRole="button"
			accessibilityLabel={label}
			testID={testID}
		>
			<View style={styles.box}>{children}</View>
			<Text style={styles.label}>{label}</Text>
		</Pressable>
	);
};

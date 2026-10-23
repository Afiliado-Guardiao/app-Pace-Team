import React from "react";
import { Pressable } from "react-native";

import { GlassSurface, Icon } from "@/components/pace";
import { ITheme, useTheme } from "@/theme";

interface IGlassCircleButtonProps {
	icon: string;
	label: string;
	onPress?: () => void;
	iconSize?: number;
	testID?: string;
}

const SIZE = 44;
const BLUR = 70; // blur(14px)

const createGlassCircleButtonStyles = (theme: ITheme) => ({
	surface: {
		width: SIZE,
		height: SIZE,
		alignItems: "center" as const,
		justifyContent: "center" as const,
	},
	appearance: {
		fill: { color: theme.pace.colors.cameraBtnFill },
		blur: BLUR,
		border: theme.pace.colors.cameraBtnBorder,
		rim: true,
	},
});

// Botão redondo de vidro claro da câmera (fechar, flash, virar câmera).
export const GlassCircleButton: React.FC<IGlassCircleButtonProps> = ({
	icon,
	label,
	onPress,
	iconSize = 18,
	testID,
}) => {
	const { theme } = useTheme();
	const styles = createGlassCircleButtonStyles(theme);

	return (
		<Pressable
			onPress={onPress}
			accessibilityRole="button"
			accessibilityLabel={label}
			testID={testID}
		>
			<GlassSurface appearance={styles.appearance} radius={SIZE / 2} style={styles.surface}>
				<Icon name={icon} size={iconSize} />
			</GlassSurface>
		</Pressable>
	);
};

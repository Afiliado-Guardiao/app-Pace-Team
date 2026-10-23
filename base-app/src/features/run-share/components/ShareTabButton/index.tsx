import React from "react";
import { Pressable, Text } from "react-native";

import { GlassSurface, Icon } from "@/components/pace";
import { ITheme, useTheme } from "@/theme";

interface IShareTabButtonProps {
	icon: string;
	label: string;
	isActive: boolean;
	onPress: () => void;
	testID?: string;
}

const HEIGHT = 44;

const createShareTabButtonStyles = (theme: ITheme, isActive: boolean) => {
	const { blur, colors, typography } = theme.pace;
	return {
		pressable: { flex: 1 },
		surface: {
			height: HEIGHT,
			flexDirection: "row" as const,
			alignItems: "center" as const,
			justifyContent: "center" as const,
			gap: 7,
		},
		appearance: {
			fill: isActive ? { color: colors.shareTabActive } : ("glassFill" as const),
			blur: blur.intensity.glass,
			border: isActive ? colors.shareTabActiveBorder : colors.glassBorder,
			rim: true,
		},
		label: {
			fontFamily: typography.fonts.bold,
			fontSize: typography.sizes.sm,
			color: colors.textPrimary,
		},
	};
};

// Alternador "Templates" / "Fundo" da tela de compartilhar.
export const ShareTabButton: React.FC<IShareTabButtonProps> = ({
	icon,
	label,
	isActive,
	onPress,
	testID,
}) => {
	const { theme } = useTheme();
	const styles = createShareTabButtonStyles(theme, isActive);

	return (
		<Pressable
			style={styles.pressable}
			onPress={onPress}
			accessibilityRole="button"
			accessibilityLabel={label}
			accessibilityState={{ selected: isActive }}
			testID={testID}
		>
			<GlassSurface appearance={styles.appearance} radius={HEIGHT / 2} style={styles.surface}>
				<Icon name={icon} size={16} />
				<Text style={styles.label}>{label}</Text>
			</GlassSurface>
		</Pressable>
	);
};

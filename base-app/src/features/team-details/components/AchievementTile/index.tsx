import React from "react";
import { Text, View } from "react-native";

import { GlassSurface, Icon } from "@/components/pace";
import { ITheme, useTheme } from "@/theme";

interface IAchievementTileProps {
	icon: string;
	label: string;
	// Ainda não conquistada: ícone e rótulo apagados
	isLocked?: boolean;
}

const DOT = 40;

const createAchievementTileStyles = (theme: ITheme) => {
	const { blur, colors, typography } = theme.pace;
	return {
		tile: {
			flex: 1,
			alignItems: "center" as const,
			gap: 8,
			paddingVertical: 14,
			paddingHorizontal: 4,
		},
		appearance: {
			fill: "glassFill" as const,
			blur: blur.intensity.glass,
			border: colors.glassBorder,
			rim: true,
		},
		dot: {
			width: DOT,
			height: DOT,
			borderRadius: DOT / 2,
			alignItems: "center" as const,
			justifyContent: "center" as const,
			backgroundColor: colors.accentSoft,
		},
		label: {
			fontFamily: typography.fonts.semibold,
			fontSize: typography.sizes.xs,
			color: colors.textSecondary,
		},
		labelLocked: { color: colors.textDisabled },
		dotLocked: { backgroundColor: colors.glass2 },
	};
};

// Conquista da equipe: ícone laranja em círculo e rótulo curto.
export const AchievementTile: React.FC<IAchievementTileProps> = ({
	icon,
	label,
	isLocked = false,
}) => {
	const { theme } = useTheme();
	const styles = createAchievementTileStyles(theme);

	return (
		<GlassSurface appearance={styles.appearance} radius={20} style={styles.tile}>
			<View style={[styles.dot, isLocked ? styles.dotLocked : null]}>
				<Icon
					name={icon}
					size={19}
					color={isLocked ? theme.pace.colors.textDisabled : theme.pace.colors.orange[400]}
				/>
			</View>
			<Text style={[styles.label, isLocked ? styles.labelLocked : null]}>{label}</Text>
		</GlassSurface>
	);
};

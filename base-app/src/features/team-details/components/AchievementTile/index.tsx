import React from "react";
import { Text } from "react-native";

import { GlassSurface } from "@/components/pace";
import { PrizeIcon } from "@/components/shared/PrizeIcon";
import { ITheme, useTheme } from "@/theme";
import { ITeamPrizeId } from "@/lib/prizes";

interface IAchievementTileProps {
	id: ITeamPrizeId;
	label: string;
	// Ainda não conquistada: apagada, com o cadeado no canto
	isLocked?: boolean;
	onPress: () => void;
}

const ART = 54;

const createAchievementTileStyles = (theme: ITheme) => {
	const { blur, colors, typography } = theme.pace;
	return {
		tile: {
			flex: 1,
			alignItems: "center" as const,
			gap: 6,
			paddingVertical: 12,
			paddingHorizontal: 4,
		},
		appearance: {
			fill: "glassFill" as const,
			blur: blur.intensity.glass,
			border: colors.glassBorder,
			rim: true,
		},
		label: {
			fontFamily: typography.fonts.semibold,
			fontSize: typography.sizes.xs,
			color: colors.textSecondary,
		},
		labelLocked: { color: colors.textDisabled },
	};
};

// Conquista da equipe: troféu/escudo 3D e rótulo curto. Tocar abre grande.
export const AchievementTile: React.FC<IAchievementTileProps> = ({
	id,
	label,
	isLocked = false,
	onPress,
}) => {
	const { theme } = useTheme();
	const styles = createAchievementTileStyles(theme);

	return (
		<GlassSurface appearance={styles.appearance} radius={20} style={styles.tile}>
			<PrizeIcon id={id} size={ART} isLocked={isLocked} onPress={onPress} />
			<Text style={[styles.label, isLocked ? styles.labelLocked : null]}>{label}</Text>
		</GlassSurface>
	);
};

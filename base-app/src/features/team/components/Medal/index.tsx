import React from "react";
import { Text, View } from "react-native";

import { GradientLayers } from "@/components/pace";
import { ITheme, useTheme } from "@/theme";

import { MEDALS } from "../../constants";

interface IMedalProps {
	// 0 = ouro, 1 = prata, 2 = bronze
	place: number;
	size?: number;
}

const createMedalStyles = (theme: ITheme, size: number, place: number) => {
	const { colors, typography } = theme.pace;
	const medal = MEDALS.at(place) ?? MEDALS[0];
	return {
		root: {
			width: size,
			height: size,
			borderRadius: size / 2,
			overflow: "hidden" as const,
			alignItems: "center" as const,
			justifyContent: "center" as const,
			borderWidth: 1,
			borderColor: colors.medalBorder,
			boxShadow: `0 4px 12px -3px ${colors[medal.glow]}, inset 0 1px 0 rgba(255,255,255,.8), inset 0 -2px 3px rgba(0,0,0,.18)`,
		},
		layer: { position: "absolute" as const, top: 0, left: 0 },
		number: {
			fontFamily: typography.fonts.extrabold,
			fontSize: Math.round(size * 0.46),
			color: colors[medal.ink],
		},
		gradient: medal.gradient,
		label: `Medalha de ${medal.name}`,
	};
};

// Medalha do pódio semanal da equipe (ouro, prata ou bronze).
export const Medal: React.FC<IMedalProps> = ({ place, size = 26 }) => {
	const { theme } = useTheme();
	const styles = createMedalStyles(theme, size, place);

	return (
		<View style={styles.root} accessibilityLabel={styles.label}>
			<View style={styles.layer}>
				<GradientLayers layers={theme.pace.gradients[styles.gradient]} width={size} height={size} />
			</View>
			<Text style={styles.number}>{place + 1}</Text>
		</View>
	);
};

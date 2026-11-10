import React from "react";
import { View } from "react-native";

import { BUDDY_H, BUDDY_W, BuddyFigure, IBuddyPose } from "@/components/buddy";
import { Icon } from "@/components/pace";
import { ITheme, useTheme } from "@/theme";

interface IFeatureHeroProps {
	icon: string;
}

const STAGE = 150;
const DOT = 46;
const NO_ACCESSORIES = [] as const;
const POSE: IBuddyPose = { act: "wave", phase: null, blink: false, gx: 0, gy: 0 };

const createFeatureHeroStyles = (theme: ITheme) => {
	const { colors, shadows } = theme.pace;
	return {
		root: { alignItems: "center" as const },
		stage: {
			width: STAGE,
			height: STAGE,
			borderRadius: STAGE / 2,
			alignItems: "center" as const,
			justifyContent: "center" as const,
			backgroundColor: colors.accentSoft,
			borderWidth: 1,
			borderColor: colors.accentBorderSoft,
		},
		figure: { width: BUDDY_W, height: BUDDY_H },
		dot: {
			position: "absolute" as const,
			right: 0,
			bottom: 4,
			width: DOT,
			height: DOT,
			borderRadius: DOT / 2,
			alignItems: "center" as const,
			justifyContent: "center" as const,
			backgroundColor: colors.accent,
			boxShadow: shadows.glowAccentOuter,
		},
		icon: colors.onAccent,
	};
};

// Buddy acenando num halo laranja, com o ícone do recurso no canto
export const FeatureHero: React.FC<IFeatureHeroProps> = ({ icon }) => {
	const { theme } = useTheme();
	const styles = createFeatureHeroStyles(theme);

	return (
		<View style={styles.root}>
			<View style={styles.stage}>
				<View style={styles.figure} pointerEvents="none">
					<BuddyFigure pose={POSE} color="branco" accessories={NO_ACCESSORIES} />
				</View>
				<View style={styles.dot}>
					<Icon name={icon} size={22} color={styles.icon} />
				</View>
			</View>
		</View>
	);
};

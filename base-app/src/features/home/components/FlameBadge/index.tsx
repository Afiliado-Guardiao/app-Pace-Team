import React from "react";
import { View } from "react-native";

import Animated from "react-native-reanimated";

import { GlassSurface, Icon, IGlassAppearance } from "@/components/pace";
import { ITheme, useTheme } from "@/theme";

import { usePulseRing } from "../../hooks/usePulseRing";

interface IFlameBadgeProps {
	isDone: boolean;
	size: number;
}

const ICON_RATIO = 0.46;
const ICON_STROKE = 2.1;

const createFlameBadgeStyles = (theme: ITheme, size: number, isDone: boolean) => {
	const { colors, shadows } = theme.pace;
	const box = { width: size, height: size, borderRadius: size / 2 };
	const appearance: IGlassAppearance = {
		fill: isDone ? "success" : "accent",
		border: null,
		outerShadow: isDone ? shadows.flameSuccess : shadows.flameAccent,
	};
	return {
		box,
		ring: { ...box, position: "absolute" as const, backgroundColor: colors.accentRing },
		badge: { ...box, alignItems: "center" as const, justifyContent: "center" as const },
		appearance,
	};
};

// Círculo do Modo Virada: chama laranja pulsando, ou troféu verde na virada.
export const FlameBadge: React.FC<IFlameBadgeProps> = ({ isDone, size }) => {
	const { theme } = useTheme();
	const ring = usePulseRing(!isDone);
	const styles = createFlameBadgeStyles(theme, size, isDone);

	return (
		<View style={styles.box}>
			{isDone ? null : <Animated.View pointerEvents="none" style={[styles.ring, ring]} />}
			<GlassSurface appearance={styles.appearance} radius={size / 2} style={styles.badge}>
				<Icon
					name={isDone ? "trophy" : "flame"}
					size={Math.round(size * ICON_RATIO)}
					strokeWidth={ICON_STROKE}
					color={theme.pace.colors.ink.white}
				/>
			</GlassSurface>
		</View>
	);
};

import React from "react";
import { Pressable, Text } from "react-native";

import Animated from "react-native-reanimated";

import { GlassSurface, Icon, tracking } from "@/components/pace";
import { ITheme, useTheme } from "@/theme";

import { RUN_COPY } from "../../constants";
import { useStartPulse } from "../../hooks/useStartPulse";

interface IStartButtonProps {
	enabled: boolean;
	onPress: () => void;
}

const SIZE = 92;
const DISABLED = 0.55;

const createStartButtonStyles = (theme: ITheme, enabled: boolean) => {
	const { colors, typography } = theme.pace;
	const box = { width: SIZE, height: SIZE, borderRadius: SIZE / 2 };
	return {
		wrap: { ...box, opacity: enabled ? 1 : DISABLED },
		glow: { ...box, position: "absolute" as const },
		disc: { ...box, alignItems: "center" as const, justifyContent: "center" as const, gap: 4 },
		label: {
			fontFamily: typography.fonts.extrabold,
			fontSize: typography.sizes.sm,
			letterSpacing: tracking(0.06, typography.sizes.sm),
			color: colors.ink.white,
		},
	};
};

// Botão "INICIAR": disco laranja de 92 com anel de brilho que respira.
export const StartButton: React.FC<IStartButtonProps> = ({ enabled, onPress }) => {
	const { theme } = useTheme();
	const styles = createStartButtonStyles(theme, enabled);
	const pulse = useStartPulse();

	return (
		<Pressable
			onPress={onPress}
			disabled={!enabled}
			accessibilityRole="button"
			accessibilityLabel="Iniciar corrida"
			accessibilityState={{ disabled: !enabled }}
			testID="run-start"
			style={styles.wrap}
		>
			<Animated.View style={[styles.glow, pulse]} />
			<GlassSurface
				appearance={{ fill: "accent", border: null }}
				radius={SIZE / 2}
				style={styles.disc}
			>
				<Icon name="play" size={26} strokeWidth={2.4} color={theme.pace.colors.ink.white} />
				<Text style={styles.label}>{RUN_COPY.start}</Text>
			</GlassSurface>
		</Pressable>
	);
};

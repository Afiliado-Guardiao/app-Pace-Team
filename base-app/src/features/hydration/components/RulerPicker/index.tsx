import React from "react";
import { ScrollView, Text, View } from "react-native";

import { ITheme, useTheme } from "@/theme";

import { IRulerScale, RULER_GAP, useRuler } from "../../hooks/useRuler";

interface IRulerPickerProps {
	scale: IRulerScale;
	value: number;
	onChange: (value: number) => void;
	label: string;
	testID: string;
}

const H = 86;

const createRulerStyles = (theme: ITheme) => {
	const { colors, typography } = theme.pace;
	return {
		root: { height: H, marginHorizontal: -20 },
		cell: { width: RULER_GAP, height: H, alignItems: "center" as const },
		tick: {
			marginTop: 14,
			width: 2,
			height: 22,
			borderRadius: 1,
			backgroundColor: colors.textTertiary,
		},
		major: { height: 42, marginTop: 4, backgroundColor: colors.textSecondary },
		label: {
			position: "absolute" as const,
			top: 54,
			width: 44,
			left: RULER_GAP / 2 - 22,
			textAlign: "center" as const,
			fontFamily: typography.numericFonts.semibold,
			fontSize: typography.sizes.xs,
			color: colors.textSecondary,
		},
		needle: {
			position: "absolute" as const,
			left: "50%" as const,
			marginLeft: -2,
			top: 0,
			width: 4,
			height: 50,
			borderRadius: 2,
			backgroundColor: colors.accent,
			boxShadow: `0 0 12px ${colors.accent}`,
		},
	};
};

// Régua deitada do PACE HYDRATION (peso, altura, idade): desliza para os lados
export const RulerPicker: React.FC<IRulerPickerProps> = ({
	scale,
	value,
	onChange,
	label,
	testID,
}) => {
	const { theme } = useTheme();
	const styles = createRulerStyles(theme);
	const ruler = useRuler(scale, value, onChange);

	return (
		<View style={styles.root} onLayout={ruler.onLayout}>
			<ScrollView
				ref={ruler.scrollRef}
				horizontal
				showsHorizontalScrollIndicator={false}
				snapToInterval={RULER_GAP}
				decelerationRate="fast"
				scrollEventThrottle={16}
				onScroll={ruler.onScroll}
				contentContainerStyle={{ paddingHorizontal: ruler.pad }}
				accessibilityLabel={label}
				testID={testID}
			>
				{ruler.ticks.map((t) => (
					<View key={t.i} style={styles.cell}>
						<View style={[styles.tick, t.isMajor && styles.major]} />
						{t.label ? <Text style={styles.label}>{t.label}</Text> : null}
					</View>
				))}
			</ScrollView>
			<View style={styles.needle} pointerEvents="none" />
		</View>
	);
};

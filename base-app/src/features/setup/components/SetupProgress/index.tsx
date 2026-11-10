import React from "react";
import { Pressable, View } from "react-native";

import { GlassSurface, GradientLayers, Icon } from "@/components/pace";
import { ITheme, useTheme } from "@/theme";

import { SEGMENTS, SETUP_COPY } from "../../constants";

interface ISetupProgressProps {
	// Segmento atual (1…7)
	current: number;
	onBack?: () => void;
}

const BACK = 40;
const BAR_H = 4;
const SEG_W = 90;

const createSetupProgressStyles = (theme: ITheme) => {
	const { colors, spacing, blur } = theme.pace;
	return {
		root: { flexDirection: "row" as const, alignItems: "center" as const, gap: spacing[3] },
		back: {
			width: BACK,
			height: BACK,
			alignItems: "center" as const,
			justifyContent: "center" as const,
		},
		backAppearance: {
			fill: "glassFill" as const,
			blur: blur.intensity.glass,
			border: colors.glassBorder,
			rim: true,
		},
		bars: { flex: 1, flexDirection: "row" as const, gap: 5 },
		seg: {
			flex: 1,
			height: BAR_H,
			borderRadius: BAR_H,
			overflow: "hidden" as const,
			backgroundColor: colors.trackEmpty,
		},
		now: { boxShadow: theme.pace.shadows.accentSoftGlow },
		spacer: { width: BACK },
	};
};

// Topo das telas 02–08: voltar (vidro) e a barra de 7 segmentos laranja
export const SetupProgress: React.FC<ISetupProgressProps> = ({ current, onBack }) => {
	const { theme } = useTheme();
	const styles = createSetupProgressStyles(theme);
	const segments = Array.from({ length: SEGMENTS }, (_, i) => i + 1);

	return (
		<View style={styles.root}>
			{onBack ? (
				<Pressable
					onPress={onBack}
					accessibilityRole="button"
					accessibilityLabel={SETUP_COPY.back}
					testID="setup-back"
				>
					<GlassSurface appearance={styles.backAppearance} radius={BACK / 2} style={styles.back}>
						<Icon name="chevron-left" size={20} />
					</GlassSurface>
				</Pressable>
			) : (
				<View style={styles.spacer} />
			)}
			<View style={styles.bars}>
				{segments.map((n) => (
					<View key={n} style={[styles.seg, n === current ? styles.now : null]}>
						{n <= current ? (
							<GradientLayers layers={theme.pace.gradients.progress} width={SEG_W} height={BAR_H} />
						) : null}
					</View>
				))}
			</View>
		</View>
	);
};

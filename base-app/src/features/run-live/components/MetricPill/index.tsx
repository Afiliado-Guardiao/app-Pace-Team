import React from "react";
import { Text, View } from "react-native";

import { GlassSurface, Icon } from "@/components/pace";
import { ITheme, useTheme } from "@/theme";

interface IMetricPillProps {
	icon: string;
	label: string;
	value: string;
}

const HEIGHT = 62;
const ICON_DOT = 46;

const createMetricPillStyles = (theme: ITheme) => {
	const { blur, borders, colors, shadows, typography } = theme.pace;
	return {
		pill: {
			flexDirection: "row" as const,
			alignItems: "center" as const,
			gap: 10,
			height: HEIGHT,
			paddingLeft: 8,
			paddingRight: 18,
		},
		appearance: {
			fill: "glassFill" as const,
			blur: blur.intensity.glass,
			border: colors.glassBorder,
			rim: true,
			outerShadow: shadows.glassOuter,
			innerShadow: shadows.glassInner,
		},
		iconDot: {
			width: ICON_DOT,
			height: ICON_DOT,
			borderRadius: ICON_DOT / 2,
			alignItems: "center" as const,
			justifyContent: "center" as const,
			backgroundColor: colors.iconDotSoft,
			borderWidth: borders.hairline,
			borderColor: colors.iconDotBorder,
		},
		label: {
			fontFamily: typography.fonts.medium,
			fontSize: typography.sizes.xs,
			color: colors.textSecondary,
		},
		value: {
			marginTop: 5,
			fontFamily: typography.fonts.bold,
			fontSize: typography.sizes.lg,
			fontVariant: [...typography.tabularNums],
			color: colors.textPrimary,
		},
	};
};

// Métrica ao vivo em pílula de vidro (ritmo, km/h).
export const MetricPill: React.FC<IMetricPillProps> = ({ icon, label, value }) => {
	const { theme } = useTheme();
	const styles = createMetricPillStyles(theme);

	return (
		<GlassSurface appearance={styles.appearance} radius={HEIGHT / 2} style={styles.pill}>
			<View style={styles.iconDot}>
				<Icon name={icon} size={18} />
			</View>
			<View>
				<Text style={styles.label}>{label}</Text>
				<Text style={styles.value}>{value}</Text>
			</View>
		</GlassSurface>
	);
};

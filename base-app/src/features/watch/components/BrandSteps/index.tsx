import React from "react";
import { Text, View } from "react-native";

import { GlassCard } from "@/components/pace";
import { ITheme, useTheme } from "@/theme";

import { WATCH_BRANDS } from "../../constants";

const createBrandStepsStyles = (theme: ITheme) => {
	const { colors, spacing, typography } = theme.pace;
	return {
		root: { gap: spacing[3] },
		item: { gap: 2 },
		name: {
			fontFamily: typography.fonts.bold,
			fontSize: typography.sizes.ui,
			color: colors.textPrimary,
		},
		how: {
			fontFamily: typography.fonts.medium,
			fontSize: typography.sizes.sm,
			lineHeight: typography.sizes.sm * 1.45,
			color: colors.textSecondary,
		},
	};
};

// Onde ligar o envio para o app Saúde em cada marca de relógio.
export const BrandSteps: React.FC = () => {
	const { theme } = useTheme();
	const styles = createBrandStepsStyles(theme);

	return (
		<GlassCard testID="watch-brands">
			<View style={styles.root}>
				{WATCH_BRANDS.map((brand) => (
					<View key={brand.name} style={styles.item}>
						<Text style={styles.name}>{brand.name}</Text>
						<Text style={styles.how}>{brand.how}</Text>
					</View>
				))}
			</View>
		</GlassCard>
	);
};

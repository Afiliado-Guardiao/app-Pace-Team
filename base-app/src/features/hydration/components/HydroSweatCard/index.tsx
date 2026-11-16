import React from "react";
import { Text, View } from "react-native";

import { Button, GlassCard } from "@/components/pace";
import { ITheme, useTheme } from "@/theme";
import { ISweatTest, sweatRateOf } from "@/lib/hydration";

import { HYDRO_COPY as C } from "../../constants";

interface IHydroSweatCardProps {
	tests: readonly ISweatTest[];
	personalRate: number | null;
	onAdd: () => void;
}

const createHydroSweatCardStyles = (theme: ITheme) => {
	const { colors, spacing, typography } = theme.pace;
	return {
		title: {
			fontFamily: typography.fonts.bold,
			fontSize: typography.sizes.md,
			color: colors.textPrimary,
		},
		rate: {
			marginTop: spacing[2],
			fontFamily: typography.numericFonts.bold,
			fontSize: 28,
			color: colors.textPrimary,
		},
		text: {
			marginTop: spacing[1],
			fontFamily: typography.fonts.medium,
			fontSize: typography.sizes.sm,
			lineHeight: typography.sizes.sm * 1.45,
			color: colors.textSecondary,
		},
		list: { marginTop: spacing[2], gap: 4 },
		item: {
			fontFamily: typography.fonts.medium,
			fontSize: typography.sizes.xs,
			color: colors.textTertiary,
		},
		button: { marginTop: spacing[3] },
	};
};

const lph = (v: number): string => `${v.toFixed(2).replace(".", ",")} L`;
const date = (t: number): string => {
	const d = new Date(t);
	return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`;
};

// Taxa de suor pela pesagem: deixa as próximas estimativas do seu jeito
export const HydroSweatCard: React.FC<IHydroSweatCardProps> = ({ tests, personalRate, onAdd }) => {
	const { theme } = useTheme();
	const styles = createHydroSweatCardStyles(theme);

	return (
		<GlassCard testID="hydro-sweat">
			<Text style={styles.title}>{C.sweatTitle}</Text>
			{personalRate !== null ? <Text style={styles.rate}>{`${lph(personalRate)}/h`}</Text> : null}
			<Text style={styles.text}>{C.sweatText}</Text>
			<View style={styles.list}>
				{tests.length === 0 ? <Text style={styles.item}>{C.sweatNone}</Text> : null}
				{tests.slice(0, 5).map((t) => {
					const rate = sweatRateOf(t);
					return rate === null ? null : (
						<Text key={t.id} style={styles.item}>
							{`${date(t.at)} · ${C.sweatItem(lph(rate), String(t.minutes))}`}
						</Text>
					);
				})}
			</View>
			<Button
				variant="glass"
				icon="scale"
				fullWidth
				style={styles.button}
				onPress={onAdd}
				testID="hydro-sweat-add"
			>
				{C.sweatAdd}
			</Button>
		</GlassCard>
	);
};

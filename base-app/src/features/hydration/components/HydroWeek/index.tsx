import React from "react";
import { DimensionValue, Text, View } from "react-native";

import { GlassCard } from "@/components/pace";
import { ITheme, useTheme } from "@/theme";
import { formatMl, IHydroDay } from "@/lib/hydration";

import { DAY_LETTERS, HYDRO_COPY as C } from "../../constants";

interface IHydroWeekProps {
	week: readonly IHydroDay[];
	// Estimativa base (linha de referência)
	baseMl: number;
}

const BAR_H = 90;
const WATER = "#8FD9FF";

const createHydroWeekStyles = (theme: ITheme) => {
	const { colors, spacing, typography } = theme.pace;
	return {
		title: {
			fontFamily: typography.fonts.bold,
			fontSize: typography.sizes.md,
			color: colors.textPrimary,
		},
		row: {
			marginTop: spacing[3],
			height: BAR_H + 34,
			flexDirection: "row" as const,
			alignItems: "flex-end" as const,
			justifyContent: "space-between" as const,
		},
		col: { flex: 1, alignItems: "center" as const, gap: 4 },
		value: {
			fontFamily: typography.numericFonts.regular,
			fontSize: typography.sizes["2xs"],
			color: colors.textSecondary,
		},
		track: {
			width: 14,
			height: BAR_H,
			borderRadius: 7,
			justifyContent: "flex-end" as const,
			overflow: "hidden" as const,
			backgroundColor: colors.barEmpty,
		},
		day: {
			fontFamily: typography.fonts.semibold,
			fontSize: typography.sizes.xs,
			color: colors.textTertiary,
		},
	};
};

// Histórico: quanto foi registrado em cada um dos últimos 7 dias
export const HydroWeek: React.FC<IHydroWeekProps> = ({ week, baseMl }) => {
	const { theme } = useTheme();
	const styles = createHydroWeekStyles(theme);
	const top = Math.max(baseMl, ...week.map((d) => d.ml), 1);

	return (
		<GlassCard testID="hydro-week">
			<Text style={styles.title}>{C.weekTitle}</Text>
			<View style={styles.row}>
				{week.map((d) => (
					<View key={d.day} style={styles.col}>
						<Text style={styles.value}>{d.ml ? formatMl(d.ml).replace(" ", "") : "–"}</Text>
						<View style={styles.track}>
							<View
								style={{
									height: `${String(Math.round((d.ml / top) * 100))}%` as DimensionValue,
									borderRadius: 7,
									backgroundColor: WATER,
								}}
							/>
						</View>
						<Text style={styles.day}>{DAY_LETTERS[new Date(d.day).getDay()]}</Text>
					</View>
				))}
			</View>
		</GlassCard>
	);
};

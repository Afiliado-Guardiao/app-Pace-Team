import React from "react";
import { Text, View } from "react-native";

import { Button, Chip, Sheet } from "@/components/pace";
import { ITheme, useTheme } from "@/theme";

import { HISTORY_COPY } from "../../constants";
import { IUseHistoryMonthReturn } from "../../hooks/useHistoryMonth";
import { DayGrid } from "../DayGrid";

interface IMonthSheetProps {
	month: IUseHistoryMonthReturn;
}

const createMonthSheetStyles = (theme: ITheme) => {
	const { colors, typography, spacing } = theme.pace;
	return {
		body: { gap: spacing[3] },
		months: { flexDirection: "row" as const, flexWrap: "wrap" as const, gap: spacing[2] },
		hint: {
			fontFamily: typography.fonts.medium,
			fontSize: typography.sizes.xs,
			color: colors.textSecondary,
		},
	};
};

// Calendário do Histórico: os meses que têm corrida (e o mês atual) e, embaixo,
// os dias do mês escolhido para achar uma corrida específica
export const MonthSheet: React.FC<IMonthSheetProps> = ({ month }) => {
	const { theme } = useTheme();
	const styles = createMonthSheetStyles(theme);
	return (
		<Sheet
			open={month.isPickerOpen}
			title={HISTORY_COPY.pickMonth}
			onClose={month.closePicker}
			actions={
				<Button
					fullWidth
					variant={month.day === null ? "primary" : "glass"}
					onPress={month.showWholeMonth}
					testID="history-month-whole"
				>
					{HISTORY_COPY.wholeMonth}
				</Button>
			}
		>
			<View style={styles.body}>
				<View style={styles.months}>
					{month.options.map((option) => (
						<Chip
							key={option.key}
							size="sm"
							selected={option.key === month.selected}
							onPress={() => {
								month.pick(option.key);
							}}
							testID={`history-month-${option.key}`}
						>
							{option.label}
						</Chip>
					))}
				</View>
				<DayGrid
					month={month.selected}
					cells={month.dayCells}
					picked={month.day}
					onPick={month.pickDay}
				/>
				<Text style={styles.hint}>{HISTORY_COPY.pickDayHint}</Text>
			</View>
		</Sheet>
	);
};

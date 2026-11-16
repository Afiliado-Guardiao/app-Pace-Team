import React from "react";
import { Pressable, Text, View } from "react-native";

import { useTheme } from "@/theme";

import { HISTORY_COPY, WEEK_DAYS } from "../../constants";
import { dayLabelLong, IDayCell } from "../../utils";

import { createDayGridStyles } from "./styles";

interface IDayGridProps {
	month: string;
	cells: readonly IDayCell[];
	picked: number | null;
	onPick: (day: number) => void;
}

type IStyles = ReturnType<typeof createDayGridStyles>;

const a11yOf = (month: string, cell: IDayCell, day: number): string =>
	cell.runs > 0
		? `${dayLabelLong(month, day)}, ${HISTORY_COPY.runsOnDay(cell.runs)}`
		: dayLabelLong(month, day);

const DayCell: React.FC<{
	month: string;
	cell: IDayCell;
	isPicked: boolean;
	styles: IStyles;
	onPick: (day: number) => void;
}> = ({ month, cell, isPicked, styles, onPick }) => {
	if (cell.day === null) return <View style={styles.cell} />;
	const day = cell.day;
	const hasRuns = cell.runs > 0;
	return (
		<View style={styles.cell}>
			<Pressable
				testID={`history-day-${String(day)}`}
				accessibilityRole="button"
				accessibilityLabel={a11yOf(month, cell, day)}
				accessibilityState={{ selected: isPicked, disabled: !hasRuns }}
				disabled={!hasRuns}
				onPress={() => {
					onPick(day);
				}}
				style={[
					styles.box,
					hasRuns && styles.hasRuns,
					cell.isToday && styles.today,
					isPicked && styles.picked,
				]}
			>
				<Text style={[styles.num, hasRuns && styles.numRuns, isPicked && styles.numPicked]}>
					{day}
				</Text>
				{hasRuns ? <View style={[styles.dot, isPicked && styles.dotPicked]} /> : null}
			</Pressable>
		</View>
	);
};

// Dias do mês: os que têm corrida ficam marcados (pontinho laranja) e dá
// para tocar; os outros ficam apagados
export const DayGrid: React.FC<IDayGridProps> = ({ month, cells, picked, onPick }) => {
	const { theme } = useTheme();
	const styles = createDayGridStyles(theme);
	return (
		<View style={styles.grid}>
			{WEEK_DAYS.map((w, i) => (
				<Text key={`w${String(i)}`} style={styles.week}>
					{w}
				</Text>
			))}
			{cells.map((cell, i) => (
				<DayCell
					key={cell.day === null ? `b${String(i)}` : `d${String(cell.day)}`}
					month={month}
					cell={cell}
					isPicked={cell.day !== null && cell.day === picked}
					styles={styles}
					onPick={onPick}
				/>
			))}
		</View>
	);
};

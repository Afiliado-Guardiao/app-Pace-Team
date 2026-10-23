import React from "react";
import { Text, View } from "react-native";

import { ITheme, useTheme } from "@/theme";
import { formatPace } from "@/lib/pace";
import { IRunGoal } from "@/lib/run";

import { RUN_COPY } from "../../constants";
import { parseKm, parseMinutes, parsePace, useGoalEditor } from "../../hooks/useGoalEditor";
import { GoalField } from "../GoalField";

interface IGoalEditorProps {
	goal: IRunGoal;
	onChange: (goal: IRunGoal) => void;
}

const HOUR = 60;

const formatMinutes = (m: number): string =>
	m >= HOUR ? `${String(Math.floor(m / HOUR))}:${String(m % HOUR).padStart(2, "0")}` : String(m);

const createGoalEditorStyles = (theme: ITheme) => ({
	root: { gap: theme.pace.spacing[2] },
	row: { flexDirection: "row" as const, gap: theme.pace.spacing[2] },
	hint: {
		textAlign: "center" as const,
		fontFamily: theme.pace.typography.fonts.medium,
		fontSize: theme.pace.typography.sizes.xs,
		lineHeight: theme.pace.typography.sizes.xs * 1.3,
		color: theme.pace.colors.textTertiary,
	},
});

// Meta da corrida: distância, tempo e ritmo (dois definem o terceiro).
export const GoalEditor: React.FC<IGoalEditorProps> = ({ goal, onChange }) => {
	const { theme } = useTheme();
	const styles = createGoalEditorStyles(theme);
	const editor = useGoalEditor(goal, onChange);
	const km = goal.km.toFixed(1).replace(".", ",");
	const minutes = formatMinutes(goal.min);
	const pace = formatPace(goal.pace);

	return (
		<View style={styles.root}>
			<View style={styles.row}>
				<GoalField
					label={RUN_COPY.distance}
					unit="km"
					value={km}
					display={km}
					onStep={(d) => {
						editor.step("km", d);
					}}
					onType={(t) => {
						editor.apply("km", parseKm(t, goal.km));
					}}
				/>
				<GoalField
					label={RUN_COPY.time}
					unit={goal.min >= HOUR ? "h" : "min"}
					value={minutes}
					display={minutes}
					onStep={(d) => {
						editor.step("min", d);
					}}
					onType={(t) => {
						editor.apply("min", parseMinutes(t, goal.min));
					}}
				/>
				<GoalField
					label={RUN_COPY.pace}
					unit="/km"
					value={pace}
					display={pace}
					onStep={(d) => {
						editor.step("pace", d);
					}}
					onType={(t) => {
						editor.apply("pace", parsePace(t, goal.pace));
					}}
				/>
			</View>
			<Text style={styles.hint}>{RUN_COPY.goalHint}</Text>
		</View>
	);
};

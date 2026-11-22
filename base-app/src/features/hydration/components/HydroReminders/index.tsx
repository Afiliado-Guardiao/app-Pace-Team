import React from "react";
import { Text, View } from "react-native";

import { Chip, GlassCard, SegmentedControl, Switch } from "@/components/pace";
import { ITheme, useTheme } from "@/theme";
import { IHydroReminders } from "@/lib/hydration";

import { DAY_LETTERS, EVERY_OPTIONS, HOURS, HYDRO_COPY as C } from "../../constants";
import { HourStepper } from "../HourStepper";

interface IHydroRemindersProps {
	reminders: IHydroReminders;
	onChange: (r: Partial<IHydroReminders>) => void;
}

const createHydroRemindersStyles = (theme: ITheme) => {
	const { colors, spacing, typography } = theme.pace;
	return {
		title: {
			fontFamily: typography.fonts.bold,
			fontSize: typography.sizes.md,
			color: colors.textPrimary,
		},
		body: { marginTop: spacing[3], gap: spacing[3] },
		label: {
			fontFamily: typography.fonts.semibold,
			fontSize: typography.sizes.sm,
			color: colors.textSecondary,
		},
		row: {
			flexDirection: "row" as const,
			flexWrap: "wrap" as const,
			gap: spacing[2],
			alignItems: "center" as const,
		},
		note: {
			fontFamily: typography.fonts.medium,
			fontSize: typography.sizes.xs,
			color: colors.textTertiary,
		},
	};
};

const hh = (h: number): string => `${String(h)}h`;
const toggleDay = (days: readonly number[], d: number): number[] =>
	days.includes(d) ? days.filter((x) => x !== d) : [...days, d].sort();

// Lembretes do Buddy: liga/desliga, intervalo, horário e dias. Ligado fica
// ligado todo dia até o atleta desligar (sem pausa automática)
export const HydroReminders: React.FC<IHydroRemindersProps> = ({ reminders: r, onChange }) => {
	const { theme } = useTheme();
	const styles = createHydroRemindersStyles(theme);

	return (
		<GlassCard testID="hydro-reminders">
			<Text style={styles.title}>{C.remindersTitle}</Text>
			<View style={styles.body}>
				<Switch
					label={C.remindersOn}
					checked={r.isOn}
					onChange={(v) => {
						onChange({ isOn: v });
					}}
					testID="hydro-reminders-on"
				/>
				{r.isOn ? (
					<>
						<Text style={styles.label}>{C.every}</Text>
						<SegmentedControl
							options={EVERY_OPTIONS}
							value={String(r.everyMin)}
							onChange={(v) => {
								onChange({ everyMin: Number(v) });
							}}
							size="sm"
							testID="hydro-every"
						/>
						<Text style={styles.label}>{C.window(hh(r.startHour), hh(r.endHour))}</Text>
						<HourStepper
							label={C.startAt}
							hour={r.startHour}
							min={HOURS.min}
							max={r.endHour - 1}
							onChange={(h) => {
								onChange({ startHour: h });
							}}
							testID="hydro-start"
						/>
						<HourStepper
							label={C.endAt}
							hour={r.endHour}
							min={r.startHour + 1}
							max={HOURS.max}
							onChange={(h) => {
								onChange({ endHour: h });
							}}
							testID="hydro-end"
						/>
						<View style={styles.row}>
							{DAY_LETTERS.map((letter, d) => (
								<Chip
									key={`${letter}-${String(d)}`}
									size="sm"
									selected={r.days.includes(d)}
									onPress={() => {
										onChange({ days: toggleDay(r.days, d) });
									}}
									testID={`hydro-day-${String(d)}`}
								>
									{letter}
								</Chip>
							))}
						</View>
					</>
				) : null}
				<Switch
					label={C.postRun}
					checked={r.isPostRunOn}
					onChange={(v) => {
						onChange({ isPostRunOn: v });
					}}
					testID="hydro-postrun-on"
				/>
				<Text style={styles.note}>{C.quiet}</Text>
			</View>
		</GlassCard>
	);
};

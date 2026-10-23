import React from "react";
import { Pressable, Text, View } from "react-native";

import { Chip, GlassCard, Icon, Label, Switch } from "@/components/pace";
import { useTheme } from "@/theme";

import { BUDDY_SCREEN_COPY } from "../../constants";
import { useBuddyAlarm } from "../../hooks/useBuddyAlarm";

import { createAlarmCardStyles } from "./styles";

const Stepper: React.FC<{ value: string; label: string; onShift: (delta: number) => void }> = ({
	value,
	label,
	onShift,
}) => {
	const { theme } = useTheme();
	const styles = createAlarmCardStyles(theme);
	const orange = theme.pace.colors.orange[400];

	return (
		<View style={styles.unit}>
			<Pressable
				testID={`buddy-alarm-${label}-down`}
				accessibilityLabel={`Menos ${label}`}
				onPress={() => {
					onShift(-1);
				}}
				style={styles.stepBtn}
			>
				<Icon name="chevron-left" size={18} strokeWidth={2.4} color={orange} />
			</Pressable>
			<Text style={styles.digits}>{value}</Text>
			<Pressable
				testID={`buddy-alarm-${label}-up`}
				accessibilityLabel={`Mais ${label}`}
				onPress={() => {
					onShift(1);
				}}
				style={styles.stepBtn}
			>
				<Icon name="chevron-right" size={18} strokeWidth={2.4} color={orange} />
			</Pressable>
		</View>
	);
};

// Despertador de corrida: na hora marcada o Buddy toca fora do app.
export const AlarmCard: React.FC = () => {
	const { theme } = useTheme();
	const styles = createAlarmCardStyles(theme);
	const alarm = useBuddyAlarm();

	return (
		<View style={styles.section}>
			<Label>{BUDDY_SCREEN_COPY.alarmLabel}</Label>
			<GlassCard padding={16} testID="buddy-alarm">
				<View style={styles.card}>
					<Switch
						testID="buddy-alarm-switch"
						label={BUDDY_SCREEN_COPY.alarmSwitch}
						checked={alarm.isOn}
						onChange={alarm.toggle}
					/>
					<View style={styles.time}>
						<Stepper value={alarm.hour} label="horas" onShift={alarm.shiftHour} />
						<Text style={styles.colon}>:</Text>
						<Stepper value={alarm.minute} label="minutos" onShift={alarm.shiftMinute} />
					</View>
					<View style={styles.days}>
						{alarm.days.map((d) => (
							<Chip
								key={d.day}
								testID={`buddy-alarm-day-${String(d.day)}`}
								size="sm"
								selected={d.isOn}
								onPress={() => {
									alarm.toggleDay(d.day);
								}}
							>
								{d.label}
							</Chip>
						))}
					</View>
					<Text style={styles.hint}>{BUDDY_SCREEN_COPY.alarmHint}</Text>
				</View>
			</GlassCard>
		</View>
	);
};

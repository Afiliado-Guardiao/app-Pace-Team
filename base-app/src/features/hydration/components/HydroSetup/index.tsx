import React from "react";
import { Text, View } from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import { MiniBuddy } from "@/components/buddy";
import { Button, IconButton, Input, Switch } from "@/components/pace";
import { useTheme } from "@/theme";
import { useBuddyLook } from "@/lib/buddy";

import { HYDRO_COPY } from "../../constants";
import { SETUP_COPY as C, SETUP_STEPS } from "../../constants/setup";
import { IHydroSetup } from "../../hooks/useHydroSetup";
import { RulerPicker } from "../RulerPicker";

import { createHydroSetupStyles } from "./styles";

interface IHydroSetupProps {
	setup: IHydroSetup;
}

// Seus dados do PACE HYDRATION, um passo por tela: peso, altura e idade na
// régua deitada (o Bud em cima do número) e a orientação médica no fim
export const HydroSetup: React.FC<IHydroSetupProps> = ({ setup }) => {
	const { theme } = useTheme();
	const insets = useSafeAreaInsets();
	const look = useBuddyLook();
	const styles = createHydroSetupStyles(theme, insets.top, insets.bottom);
	if (!setup.isOpen) return null;
	const { info, ruler } = setup;

	return (
		<View style={styles.root} testID="hydro-setup">
			<View style={styles.head}>
				<IconButton
					icon="chevron-left"
					label={C.back}
					onPress={setup.back}
					testID="hydro-setup-back"
				/>
				<View style={styles.pill}>
					<Text style={styles.pillText}>{C.title}</Text>
				</View>
			</View>
			<View style={styles.bars}>
				{SETUP_STEPS.map((s, i) => (
					<View key={s.key} style={[styles.bar, i <= setup.step && styles.barOn]} />
				))}
			</View>
			<Text style={styles.kicker}>{C.kicker(setup.step + 1, SETUP_STEPS.length)}</Text>
			<Text style={styles.title}>{info.title}</Text>
			<Text style={styles.lead}>{info.lead}</Text>
			<View style={styles.body}>
				{ruler ? (
					<>
						<View style={styles.bud}>
							<MiniBuddy color={look.color} accessories={look.accessories} scale={0.9} />
						</View>
						<View style={styles.valueRow}>
							<Text style={styles.value}>{ruler.text}</Text>
							<Text style={styles.unit}>{ruler.unit}</Text>
						</View>
						<RulerPicker
							key={info.key}
							scale={ruler.scale}
							value={ruler.value}
							onChange={ruler.onChange}
							label={info.title}
							testID={`hydro-ruler-${info.key}`}
						/>
						<Text style={styles.hint}>{C.hint}</Text>
					</>
				) : (
					<View style={styles.health}>
						<Switch
							label={HYDRO_COPY.restriction}
							checked={setup.hasRestriction}
							onChange={setup.setRestriction}
							testID="hydro-restriction"
						/>
						{setup.hasRestriction ? (
							<Input
								label={HYDRO_COPY.restrictionNote}
								value={setup.note}
								onChangeText={setup.setNote}
								testID="hydro-restriction-note"
							/>
						) : null}
					</View>
				)}
			</View>
			<Button fullWidth onPress={setup.next} testID="hydro-setup-next">
				{setup.isLast ? C.done : C.next}
			</Button>
			<View style={styles.steps}>
				{SETUP_STEPS.map((s, i) => (
					<Text key={s.key} style={[styles.step, i === setup.step && styles.stepOn]}>
						{s.label}
					</Text>
				))}
			</View>
		</View>
	);
};

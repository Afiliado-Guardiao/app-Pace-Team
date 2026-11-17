import React from "react";
import { Text, View } from "react-native";

import { Button, Input, Sheet } from "@/components/pace";
import { ITheme, useTheme } from "@/theme";

import { HYDRO_COPY as C } from "../../constants";
import { IAmountForm } from "../../hooks/useAmountForm";
import { ISweatForm } from "../../hooks/useSweatForm";

interface IHydroSheetsProps {
	amount: IAmountForm;
	sweat: ISweatForm;
}

const createHydroSheetsStyles = (theme: ITheme) => {
	const { colors, spacing, typography } = theme.pace;
	return {
		form: { gap: spacing[3] },
		help: {
			fontFamily: typography.fonts.medium,
			fontSize: typography.sizes.xs,
			lineHeight: typography.sizes.xs * 1.5,
			color: colors.textSecondary,
		},
		error: {
			fontFamily: typography.fonts.semibold,
			fontSize: typography.sizes.xs,
			color: colors.statusDanger,
		},
	};
};

const Actions: React.FC<{ onSave: () => void; onCancel: () => void; id: string }> = ({
	onSave,
	onCancel,
	id,
}) => (
	<>
		<Button fullWidth onPress={onSave} testID={`${id}-save`}>
			{C.save}
		</Button>
		<Button fullWidth variant="ghost" onPress={onCancel} testID={`${id}-cancel`}>
			{C.cancel}
		</Button>
	</>
);

// As janelas de preencher do PACE HYDRATION: outro valor e pesagem
export const HydroSheets: React.FC<IHydroSheetsProps> = ({ amount, sweat }) => {
	const { theme } = useTheme();
	const styles = createHydroSheetsStyles(theme);
	const f = sweat.fields;

	return (
		<>
			<Sheet
				open={amount.isOpen}
				title={C.amountTitle}
				onClose={amount.close}
				actions={<Actions onSave={amount.confirm} onCancel={amount.close} id="hydro-amount" />}
			>
				<Input
					label={C.amountLabel}
					type="number"
					value={amount.value}
					onChangeText={amount.setValue}
					testID="hydro-amount-input"
				/>
			</Sheet>
			<Sheet
				open={sweat.isOpen}
				title={C.sweatTitle}
				onClose={sweat.close}
				actions={<Actions onSave={sweat.save} onCancel={sweat.close} id="hydro-sweat" />}
			>
				<View style={styles.form}>
					<Text style={styles.help}>{C.sweatText}</Text>
					<Input
						label={C.preKg}
						type="number"
						value={f.preKg}
						onChangeText={(v) => {
							sweat.set("preKg", v);
						}}
						testID="hydro-pre-kg"
					/>
					<Input
						label={C.postKg}
						type="number"
						value={f.postKg}
						onChangeText={(v) => {
							sweat.set("postKg", v);
						}}
						testID="hydro-post-kg"
					/>
					<Input
						label={C.minutes}
						type="number"
						value={f.minutes}
						onChangeText={(v) => {
							sweat.set("minutes", v);
						}}
						testID="hydro-minutes"
					/>
					<Input
						label={C.fluidMl}
						type="number"
						value={f.fluidMl}
						onChangeText={(v) => {
							sweat.set("fluidMl", v);
						}}
						testID="hydro-fluid"
					/>
					{sweat.error ? <Text style={styles.error}>{sweat.error}</Text> : null}
				</View>
			</Sheet>
		</>
	);
};

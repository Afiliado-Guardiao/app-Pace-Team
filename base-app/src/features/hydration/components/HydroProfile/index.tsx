import React from "react";
import { Text, View } from "react-native";

import { Button, GlassCard } from "@/components/pace";
import { ITheme, useTheme } from "@/theme";
import { IHydroBody } from "@/lib/hydration";

import { HYDRO_COPY as C } from "../../constants";

interface IHydroProfileProps {
	body: IHydroBody;
	hasRestriction: boolean;
	onEdit: () => void;
}

const createHydroProfileStyles = (theme: ITheme) => {
	const { colors, spacing, typography } = theme.pace;
	return {
		title: {
			fontFamily: typography.fonts.bold,
			fontSize: typography.sizes.md,
			color: colors.textPrimary,
		},
		row: {
			marginTop: spacing[3],
			flexDirection: "row" as const,
			justifyContent: "space-between" as const,
		},
		cell: { flex: 1, alignItems: "center" as const, gap: 2 },
		value: {
			fontFamily: typography.numericFonts.semibold,
			fontSize: typography.sizes.lg,
			color: colors.textPrimary,
		},
		empty: {
			fontFamily: typography.fonts.medium,
			fontSize: typography.sizes.xs,
			color: colors.textTertiary,
		},
		label: {
			fontFamily: typography.fonts.medium,
			fontSize: typography.sizes.xs,
			color: colors.textSecondary,
		},
		note: {
			marginTop: spacing[3],
			fontFamily: typography.fonts.medium,
			fontSize: typography.sizes.xs,
			lineHeight: typography.sizes.xs * 1.5,
			color: colors.textSecondary,
		},
		button: { marginTop: spacing[3] },
	};
};

// Os dados que a estimativa usa (a idade vem do cadastro, sem perguntar de novo)
export const HydroProfile: React.FC<IHydroProfileProps> = ({ body, hasRestriction, onEdit }) => {
	const { theme } = useTheme();
	const styles = createHydroProfileStyles(theme);
	const cells = [
		{
			id: "w",
			label: C.weight,
			value: body.weightKg ? `${String(body.weightKg).replace(".", ",")} kg` : null,
		},
		{ id: "h", label: C.height, value: body.heightCm ? `${String(body.heightCm)} cm` : null },
		{ id: "a", label: C.age, value: body.age !== null ? `${String(body.age)} anos` : null },
	];

	return (
		<GlassCard testID="hydro-profile">
			<Text style={styles.title}>{C.profileTitle}</Text>
			<View style={styles.row}>
				{cells.map((c) => (
					<View key={c.id} style={styles.cell}>
						{c.value ? (
							<Text style={styles.value}>{c.value}</Text>
						) : (
							<Text style={styles.empty}>{C.notInformed}</Text>
						)}
						<Text style={styles.label}>{c.label}</Text>
					</View>
				))}
			</View>
			{hasRestriction ? <Text style={styles.note}>{C.restrictionHelp}</Text> : null}
			<Button
				variant="glass"
				icon="pencil"
				fullWidth
				style={styles.button}
				onPress={onEdit}
				testID="hydro-edit-data"
			>
				{C.editData}
			</Button>
		</GlassCard>
	);
};

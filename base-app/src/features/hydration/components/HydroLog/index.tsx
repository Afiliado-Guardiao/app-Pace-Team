import React from "react";
import { Pressable, Text, View } from "react-native";

import { GlassCard, Icon } from "@/components/pace";
import { ITheme, useTheme } from "@/theme";
import { formatMl, IHydroLog } from "@/lib/hydration";

import { HYDRO_COPY as C } from "../../constants";

interface IHydroLogProps {
	logs: readonly IHydroLog[];
	onRemove: (id: string) => void;
}

const KIND: Record<IHydroLog["kind"], string> = {
	day: "",
	pre: " · antes da corrida",
	during: " · durante a corrida",
	post: " · reposição",
};

const createHydroLogStyles = (theme: ITheme) => {
	const { colors, spacing, typography } = theme.pace;
	return {
		title: {
			fontFamily: typography.fonts.bold,
			fontSize: typography.sizes.md,
			color: colors.textPrimary,
		},
		list: { marginTop: spacing[2], gap: spacing[1] },
		row: {
			flexDirection: "row" as const,
			alignItems: "center" as const,
			gap: spacing[2],
			paddingVertical: 6,
			borderBottomWidth: 1,
			borderBottomColor: colors.hairline,
		},
		ml: {
			fontFamily: typography.numericFonts.semibold,
			fontSize: typography.sizes.ui,
			color: colors.textPrimary,
		},
		meta: {
			flex: 1,
			fontFamily: typography.fonts.medium,
			fontSize: typography.sizes.xs,
			color: colors.textSecondary,
		},
		empty: {
			fontFamily: typography.fonts.medium,
			fontSize: typography.sizes.sm,
			color: colors.textTertiary,
		},
		icon: colors.textTertiary,
	};
};

const time = (t: number): string => {
	const d = new Date(t);
	return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
};

// O que foi registrado hoje (dá para apagar um registro errado)
export const HydroLog: React.FC<IHydroLogProps> = ({ logs, onRemove }) => {
	const { theme } = useTheme();
	const styles = createHydroLogStyles(theme);

	return (
		<GlassCard testID="hydro-log">
			<Text style={styles.title}>{C.logTitle}</Text>
			<View style={styles.list}>
				{logs.length === 0 ? <Text style={styles.empty}>{C.logEmpty}</Text> : null}
				{logs.map((l) => (
					<View key={l.id} style={styles.row}>
						<Text style={styles.ml}>{formatMl(l.ml)}</Text>
						<Text style={styles.meta}>{`${time(l.at)}${KIND[l.kind]}`}</Text>
						<Pressable
							onPress={() => {
								onRemove(l.id);
							}}
							hitSlop={10}
							accessibilityRole="button"
							accessibilityLabel={C.remove}
							testID={`hydro-remove-${l.id}`}
						>
							<Icon name="x" size={16} color={styles.icon} />
						</Pressable>
					</View>
				))}
			</View>
		</GlassCard>
	);
};

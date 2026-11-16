import React from "react";
import { Text, View } from "react-native";

import { Button, GlassCard, Icon } from "@/components/pace";
import { ITheme, useTheme } from "@/theme";
import { formatMl, IUseHydrationReturn } from "@/lib/hydration";

import { HYDRO_COPY as C } from "../../constants";

interface IHydroRunCardProps {
	hydro: IUseHydrationReturn;
	onLogPost: (ml: number) => void;
}

const createHydroRunCardStyles = (theme: ITheme) => {
	const { colors, spacing, typography } = theme.pace;
	return {
		title: {
			fontFamily: typography.fonts.bold,
			fontSize: typography.sizes.md,
			color: colors.textPrimary,
		},
		list: { marginTop: spacing[3], gap: spacing[3] },
		row: { flexDirection: "row" as const, gap: spacing[3] },
		dot: {
			width: 30,
			height: 30,
			borderRadius: 15,
			alignItems: "center" as const,
			justifyContent: "center" as const,
			backgroundColor: colors.glass2,
		},
		body: { flex: 1, gap: 2 },
		label: {
			fontFamily: typography.fonts.extrabold,
			fontSize: typography.sizes.xs,
			letterSpacing: 1,
			color: colors.textSecondary,
		},
		text: {
			fontFamily: typography.fonts.medium,
			fontSize: typography.sizes.sm,
			lineHeight: typography.sizes.sm * 1.45,
			color: colors.textPrimary,
		},
		note: {
			fontFamily: typography.fonts.medium,
			fontSize: typography.sizes.xs,
			color: colors.textTertiary,
		},
		button: { marginTop: spacing[2], alignSelf: "flex-start" as const },
	};
};

const DURING = { none: C.duringNone, sips: C.duringSips, plan: C.duringPlan } as const;

const litersPerHour = (lph: number): string => `${lph.toFixed(1).replace(".", ",")} L`;

// Antes, durante e depois da corrida, com base no peso, nas corridas e no clima
export const HydroRunCard: React.FC<IHydroRunCardProps> = ({ hydro, onLogPost }) => {
	const { theme } = useTheme();
	const styles = createHydroRunCardStyles(theme);
	const last = hydro.lastRun;
	const steps = [
		{
			id: "before",
			icon: "sunrise",
			label: C.before,
			text: C.beforeText(formatMl(hydro.preRun.min), formatMl(hydro.preRun.max)),
		},
		{ id: "during", icon: "footprints", label: C.during, text: DURING[hydro.during] },
	];

	return (
		<GlassCard testID="hydro-run">
			<Text style={styles.title}>{C.runTitle}</Text>
			<View style={styles.list}>
				{steps.map((s) => (
					<View key={s.id} style={styles.row}>
						<View style={styles.dot}>
							<Icon name={s.icon} size={16} />
						</View>
						<View style={styles.body}>
							<Text style={styles.label}>{s.label.toUpperCase()}</Text>
							<Text style={styles.text}>{s.text}</Text>
						</View>
					</View>
				))}
				<View style={styles.row}>
					<View style={styles.dot}>
						<Icon name="droplets" size={16} />
					</View>
					<View style={styles.body}>
						<Text style={styles.label}>{C.after.toUpperCase()}</Text>
						<Text style={styles.text}>
							{last
								? C.afterText(formatMl(last.hydration.replaceMl), formatMl(last.hydration.lossMl))
								: C.afterNone}
						</Text>
						{last ? (
							<Text style={styles.note}>
								{C.rateBy(litersPerHour(last.hydration.rateLph), last.hydration.isPersonal)}
							</Text>
						) : null}
						{last && !hydro.hasRestriction ? (
							<Button
								size="sm"
								variant="glass"
								icon="plus"
								style={styles.button}
								onPress={() => {
									onLogPost(Math.min(500, last.hydration.replaceMl));
								}}
								testID="hydro-log-post"
							>
								{C.afterLog}
							</Button>
						) : null}
					</View>
				</View>
			</View>
		</GlassCard>
	);
};

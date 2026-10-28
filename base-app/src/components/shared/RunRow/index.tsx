import React from "react";
import { Pressable, Text, View } from "react-native";

import { Badge, GlassSurface, MiniRoute } from "@/components/pace";
import { ITheme, useTheme } from "@/theme";
import { IRun } from "@/lib/pace";

interface IRunRowProps {
	run: IRun;
	seed: number;
	onPress: () => void;
}

const THUMB = 64;
const STATUS = {
	valid: { tone: "success", label: "Validada" },
	pending: { tone: "warning", label: "Em análise" },
	invalid: { tone: "danger", label: "Não validada" },
} as const;

const createRunRowStyles = (theme: ITheme, hasPoints: boolean) => {
	const { blur, colors, typography } = theme.pace;
	const number = {
		fontFamily: typography.fonts.bold,
		fontSize: typography.sizes.sm,
		color: colors.textPrimary,
	};
	return {
		row: { flexDirection: "row" as const, gap: 12, padding: 12 },
		appearance: {
			fill: "glassFill" as const,
			blur: blur.intensity.glass,
			border: colors.glassBorder,
			rim: true,
		},
		thumb: {
			width: THUMB,
			height: THUMB,
			borderRadius: 16,
			overflow: "hidden" as const,
			backgroundColor: colors.routeThumbBg,
			borderWidth: 1,
			borderColor: colors.hairline,
		},
		body: { flex: 1, minWidth: 0 },
		top: { flexDirection: "row" as const, justifyContent: "space-between" as const, gap: 8 },
		title: {
			flexShrink: 1,
			fontFamily: typography.fonts.bold,
			fontSize: typography.sizes.ui,
			color: colors.textPrimary,
		},
		date: {
			marginTop: 3,
			fontFamily: typography.fonts.medium,
			fontSize: typography.sizes.xs,
			color: colors.textTertiary,
		},
		stats: {
			flexDirection: "row" as const,
			gap: 14,
			marginTop: 8,
			alignItems: "baseline" as const,
		},
		number,
		unit: {
			fontFamily: typography.fonts.semibold,
			fontSize: typography.sizes.micro,
			color: colors.textTertiary,
		},
		points: {
			...number,
			marginLeft: "auto" as const,
			color: hasPoints ? colors.orange[400] : colors.textDisabled,
		},
	};
};

// Corrida no Perfil e no Histórico: percurso, status de validação e números.
export const RunRow: React.FC<IRunRowProps> = ({ run, seed, onPress }) => {
	const { theme } = useTheme();
	const styles = createRunRowStyles(theme, run.pts > 0);
	const status = STATUS[run.status];

	return (
		<Pressable
			onPress={onPress}
			accessibilityRole="button"
			accessibilityLabel={run.title}
			testID={`run-row-${String(run.id)}`}
		>
			<GlassSurface appearance={styles.appearance} radius={22} style={styles.row}>
				<View style={styles.thumb}>
					<MiniRoute seed={seed} size={THUMB} route={run.route} />
				</View>
				<View style={styles.body}>
					<View style={styles.top}>
						<Text style={styles.title}>{run.title}</Text>
						<Badge tone={status.tone} dot>
							{status.label}
						</Badge>
					</View>
					<Text style={styles.date}>{run.date}</Text>
					<View style={styles.stats}>
						<Text style={styles.number}>
							{run.km}
							<Text style={styles.unit}>{` ${run.unit ?? "km"}`}</Text>
						</Text>
						<Text style={styles.number}>{run.time}</Text>
						<Text style={styles.number}>{run.pace}</Text>
						<Text style={styles.points}>{`+${String(run.pts)} pts`}</Text>
					</View>
				</View>
			</GlassSurface>
		</Pressable>
	);
};

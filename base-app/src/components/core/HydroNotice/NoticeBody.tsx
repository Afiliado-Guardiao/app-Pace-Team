import React from "react";
import { Text, View } from "react-native";

import { Icon } from "@/components/pace";
import { ITheme, useTheme } from "@/theme";
import { formatMl, IHydroNotice } from "@/lib/hydration";

import { noticeRows } from "./rows";

interface INoticeBodyProps {
	notice: IHydroNotice;
}

const COPY = {
	lead: "Beba cerca de",
	how: "aos poucos, nas próximas 2 a 4 horas",
	why: "Por que esse valor",
	personal:
		"A conta usa a sua taxa de suor da pesagem e o tempo da corrida. Repõe um pouco mais do que você perdeu (125%).",
	estimated:
		"A conta usa o tempo da corrida, o seu pace, o peso e a temperatura. Repõe o que você perdeu de suor.",
	note: "É uma estimativa, não uma orientação médica. Beba pela sede e não force.",
} as const;

const createNoticeBodyStyles = (theme: ITheme) => {
	const { colors, spacing, typography } = theme.pace;
	const { fonts, sizes } = typography;
	return {
		root: { gap: spacing[3] },
		lead: { fontFamily: fonts.semibold, fontSize: sizes.sm, color: colors.textSecondary },
		amount: {
			fontFamily: typography.numericFonts.extrabold,
			fontSize: 40,
			color: colors.textPrimary,
		},
		how: { fontFamily: fonts.semibold, fontSize: sizes.ui, color: colors.textPrimary },
		why: {
			marginTop: spacing[1],
			fontFamily: fonts.bold,
			fontSize: sizes.xs,
			letterSpacing: 1,
			color: colors.accent,
		},
		row: { flexDirection: "row" as const, alignItems: "center" as const, gap: spacing[2] },
		label: { flex: 1, fontFamily: fonts.medium, fontSize: sizes.sm, color: colors.textSecondary },
		value: { fontFamily: fonts.bold, fontSize: sizes.sm, color: colors.textPrimary },
		text: { fontFamily: fonts.medium, fontSize: sizes.xs, color: colors.textSecondary },
		note: { fontFamily: fonts.medium, fontSize: sizes.xs, color: colors.textTertiary },
	};
};

// Quanto beber e cada dado que entrou na conta
export const NoticeBody: React.FC<INoticeBodyProps> = ({ notice }) => {
	const { theme } = useTheme();
	const styles = createNoticeBodyStyles(theme);

	return (
		<View style={styles.root}>
			<View>
				<Text style={styles.lead}>{COPY.lead}</Text>
				<Text style={styles.amount}>{formatMl(notice.replaceMl)}</Text>
				<Text style={styles.how}>{COPY.how}</Text>
			</View>
			<Text style={styles.why}>{COPY.why.toUpperCase()}</Text>
			{noticeRows(notice).map((r) => (
				<View key={r.label} style={styles.row}>
					<Icon name={r.icon} size={16} />
					<Text style={styles.label}>{r.label}</Text>
					<Text style={styles.value}>{r.value}</Text>
				</View>
			))}
			<Text style={styles.text}>{notice.isPersonal ? COPY.personal : COPY.estimated}</Text>
			<Text style={styles.note}>{COPY.note}</Text>
		</View>
	);
};

import { ITheme } from "@/theme";

const LIST_MAX = 380;

export const createTeamGameResultStyles = (theme: ITheme) => {
	const { colors, spacing, typography, radii } = theme.pace;
	const { fonts, sizes } = typography;
	const small = { fontFamily: fonts.medium, fontSize: sizes.xs };
	return {
		summary: { fontFamily: fonts.semibold, fontSize: sizes.sm, color: colors.textPrimary },
		scroll: { maxHeight: LIST_MAX, marginTop: spacing[3] },
		list: { gap: spacing[2] },
		row: {
			gap: 3,
			padding: spacing[3],
			borderRadius: radii.md,
			borderWidth: 1,
		},
		doneRow: { borderColor: colors.statusSuccess, backgroundColor: colors.statusSuccessSoft },
		failedRow: { borderColor: colors.statusDanger, backgroundColor: colors.statusDangerSoft },
		top: { flexDirection: "row" as const, alignItems: "center" as const, gap: spacing[2] },
		name: { flex: 1, fontFamily: fonts.bold, fontSize: sizes.ui, color: colors.textPrimary },
		points: { fontFamily: fonts.extrabold, fontSize: sizes.sm },
		status: { fontFamily: fonts.bold, fontSize: sizes.xs },
		done: { color: colors.statusSuccess },
		failed: { color: colors.statusDanger },
		line: { flexDirection: "row" as const, gap: spacing[2] },
		label: { ...small, width: 62, color: colors.textTertiary },
		value: { ...small, flex: 1, color: colors.textPrimary },
	};
};

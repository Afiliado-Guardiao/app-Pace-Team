import { TextStyle, ViewStyle } from "react-native";

import { ITheme } from "@/theme";

import { tracking } from "../utils";

interface ILayoutTextStyles {
	sectionHeader: ViewStyle;
	sectionTitle: TextStyle;
	sectionAction: TextStyle;
	highlight: TextStyle;
	label: TextStyle;
	note: ViewStyle;
	noteIcon: ViewStyle;
	noteText: TextStyle;
	demoTag: ViewStyle;
	demoText: TextStyle;
}

const SECTION_MARGIN = 8;
const NOTE_ICON_OFFSET = 1;
const DEMO_GAP = 4;

// Estilos de texto compartilhados pelas peças de layout.
export const createLayoutTextStyles = (theme: ITheme): ILayoutTextStyles => {
	const { colors, spacing, typography } = theme.pace;
	const { fonts, sizes } = typography;

	return {
		sectionHeader: {
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "space-between",
			marginTop: SECTION_MARGIN,
		},
		sectionTitle: {
			fontFamily: fonts.bold,
			fontSize: sizes.lg,
			lineHeight: sizes.lg * typography.lineHeights.snug,
			color: colors.textPrimary,
		},
		sectionAction: { fontFamily: fonts.semibold, fontSize: sizes.sm, color: colors.orange[400] },
		highlight: { backgroundColor: colors.orange[500], color: colors.ink.white },
		// .pt-label: micro-rótulo em caixa alta espaçada
		label: {
			fontFamily: fonts.semibold,
			fontSize: sizes.xs,
			letterSpacing: tracking(typography.tracking.label, sizes.xs),
			textTransform: "uppercase",
			color: colors.textSecondary,
		},
		note: { flexDirection: "row", gap: spacing[2.5], paddingHorizontal: spacing[1] },
		noteIcon: { marginTop: NOTE_ICON_OFFSET },
		noteText: {
			flex: 1,
			fontFamily: fonts.medium,
			fontSize: sizes.label,
			lineHeight: sizes.label * typography.lineHeights.body,
			color: colors.textTertiary,
		},
		demoTag: { flexDirection: "row", alignItems: "center", alignSelf: "center", gap: DEMO_GAP },
		demoText: { fontFamily: fonts.semibold, fontSize: sizes.micro, color: colors.textTertiary },
	};
};

import { ITheme } from "@/theme";

import { ICatalogSectionStyles, ICatalogStyles } from "../types";

const RAIL_RIGHT = 10;
const CONTENT_BOTTOM = 120;

export const createCatalogStyles = (
	theme: ITheme,
	insets: { top: number; bottom: number },
): ICatalogStyles => {
	const { colors, layout, spacing, typography } = theme.pace;

	return {
		scroll: { flex: 1 },
		content: {
			paddingTop: insets.top + spacing[2],
			paddingBottom: insets.bottom + CONTENT_BOTTOM,
			paddingLeft: spacing.screenGutter,
			paddingRight: layout.railPaddingRight,
			gap: spacing[8],
		},
		header: { gap: spacing[3] },
		headerTitle: {
			fontFamily: typography.fonts.extrabold,
			fontSize: typography.sizes.h1,
			color: colors.textPrimary,
		},
		headerHint: {
			fontFamily: typography.fonts.medium,
			fontSize: typography.sizes.sm,
			lineHeight: typography.sizes.sm * typography.lineHeights.body,
			color: colors.textSecondary,
		},
		// Trilho de abas centralizado na lateral direita, como no app
		rail: { position: "absolute", right: RAIL_RIGHT, top: 0, bottom: 0, justifyContent: "center" },
	};
};

export const createCatalogSectionStyles = (theme: ITheme): ICatalogSectionStyles => {
	const { colors, spacing, typography } = theme.pace;
	const { fonts, sizes, lineHeights } = typography;

	return {
		section: { gap: spacing.stackGap },
		title: { fontFamily: fonts.bold, fontSize: sizes.lg, color: colors.textPrimary },
		caption: {
			fontFamily: fonts.medium,
			fontSize: sizes.label,
			lineHeight: sizes.label * lineHeights.caption,
			color: colors.textTertiary,
		},
		row: { flexDirection: "row", flexWrap: "wrap", gap: spacing[2.5] },
		rowCenter: { flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: spacing[3] },
		column: { gap: spacing[2.5] },
		grow: { flex: 1 },
		growWide: { flex: 1.4 },
		label: {
			fontFamily: fonts.semibold,
			fontSize: sizes.label,
			color: colors.textSecondary,
		},
		cardTitle: { fontFamily: fonts.bold, fontSize: sizes.md, color: colors.textPrimary },
		cardText: {
			marginTop: spacing[1],
			fontFamily: fonts.medium,
			fontSize: sizes.sm,
			lineHeight: sizes.sm * lineHeights.body,
			color: colors.textSecondary,
		},
		metric: {
			fontFamily: fonts.bold,
			fontSize: sizes.metricMd,
			fontVariant: [...typography.tabularNums],
			color: colors.textPrimary,
		},
	};
};

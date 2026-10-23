import { ITheme } from "@/theme";

import { IProgressBarStyles, IProgressTone } from "../types";

export const createProgressBarStyles = (
	theme: ITheme,
	options: { height: number; tone: IProgressTone },
): IProgressBarStyles => {
	const { colors, radii, shadows, spacing, typography } = theme.pace;
	const { fonts, sizes, lineHeights } = typography;
	const headerText = {
		fontFamily: fonts.semibold,
		fontSize: sizes.label,
		lineHeight: sizes.label * lineHeights.snug,
	};
	const isSuccess = options.tone === "success";

	return {
		root: { gap: spacing[2] },
		header: { flexDirection: "row", justifyContent: "space-between", gap: spacing[3] },
		label: { ...headerText, flexShrink: 1, color: colors.textSecondary },
		valueLabel: {
			...headerText,
			fontVariant: [...typography.tabularNums],
			color: colors.textPrimary,
		},
		track: {
			height: options.height,
			borderRadius: radii.pill,
			overflow: "hidden",
			backgroundColor: colors.trackEmpty,
			boxShadow: shadows.progressTrack,
		},
		fill: {
			height: "100%",
			borderRadius: radii.pill,
			backgroundColor: isSuccess ? colors.statusSuccess : colors.transparent,
			boxShadow: isSuccess ? shadows.none : shadows.progressGlow,
		},
		// Recorte separado: o brilho da ponta não pode ser cortado pelo próprio overflow
		fillClip: {
			position: "absolute",
			top: 0,
			left: 0,
			right: 0,
			bottom: 0,
			borderRadius: radii.pill,
			overflow: "hidden",
		},
	};
};

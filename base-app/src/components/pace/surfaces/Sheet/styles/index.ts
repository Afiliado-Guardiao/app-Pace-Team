import { ITheme } from "@/theme";

import { ISheetStyles } from "../types";

const MAX_WIDTH = 480;
const PADDING_TOP = 10;
const PADDING_BOTTOM = 28;
const HANDLE_WIDTH = 40;
const HANDLE_HEIGHT = 5;
const HANDLE_RADIUS = 3;
const ACTIONS_GAP = 10;
const ACTIONS_MARGIN = 22;

export const createSheetStyles = (theme: ITheme): ISheetStyles => {
	const { blur, colors, shadows, spacing, typography } = theme.pace;
	const { sizes, fonts, lineHeights } = typography;

	return {
		root: {
			position: "absolute",
			top: 0,
			left: 0,
			right: 0,
			bottom: 0,
			zIndex: 50,
			alignItems: "center",
			justifyContent: "flex-end",
		},
		scrim: {
			position: "absolute",
			top: 0,
			left: 0,
			right: 0,
			bottom: 0,
		},
		scrimTint: {
			position: "absolute",
			top: 0,
			left: 0,
			right: 0,
			bottom: 0,
			backgroundColor: colors.surfaceScrim,
		},
		panel: {
			width: "100%",
			maxWidth: MAX_WIDTH,
			paddingTop: PADDING_TOP,
			paddingHorizontal: spacing[5],
			paddingBottom: PADDING_BOTTOM,
		},
		handle: {
			alignSelf: "center",
			width: HANDLE_WIDTH,
			height: HANDLE_HEIGHT,
			borderRadius: HANDLE_RADIUS,
			marginBottom: spacing[4],
			backgroundColor: colors.sheetHandle,
		},
		title: {
			marginBottom: spacing[3],
			fontFamily: fonts.bold,
			fontSize: sizes.xl,
			lineHeight: sizes.xl * lineHeights.snug,
			color: colors.textPrimary,
		},
		body: {
			fontFamily: fonts.regular,
			fontSize: sizes.body,
			lineHeight: sizes.body * lineHeights.body,
			color: colors.textSecondary,
		},
		actions: { gap: ACTIONS_GAP, marginTop: ACTIONS_MARGIN },
		appearance: {
			fill: { color: colors.glassPanel },
			blur: blur.intensity.sheet,
			border: colors.glassBorder,
			rim: true,
			bottomRadius: 0,
			openBottom: true,
			outerShadow: shadows.sheetOuter,
			innerShadow: shadows.sheetInner,
		},
	};
};

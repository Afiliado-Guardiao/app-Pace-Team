import { ITheme } from "@/theme";

import { tracking } from "../../../utils";
import { ISelectStyles } from "../types";

const FIELD_HEIGHT = 54;
const FIELD_PADDING_X = 16;
const LIST_GAP = 18;
// Listas longas (ex.: cidades) rolam dentro da folha
const LIST_MAX_HEIGHT = 380;

export const createSelectStyles = (theme: ITheme): ISelectStyles => {
	const { blur, colors, shadows, spacing, typography } = theme.pace;
	const { sizes, fonts } = typography;
	const valueText = { flex: 1, fontFamily: fonts.medium, fontSize: sizes.body };

	return {
		root: { width: "100%", gap: spacing[2] },
		label: {
			fontFamily: fonts.semibold,
			fontSize: sizes.label,
			letterSpacing: tracking(typography.tracking.input, sizes.label),
			color: colors.textSecondary,
		},
		field: {
			height: FIELD_HEIGHT,
			paddingHorizontal: FIELD_PADDING_X,
			flexDirection: "row",
			alignItems: "center",
			gap: spacing[2.5],
		},
		value: { ...valueText, color: colors.textPrimary },
		placeholder: { ...valueText, color: colors.textTertiary },
		list: { gap: LIST_GAP, paddingTop: spacing[1], paddingBottom: spacing[1] },
		listScroll: { maxHeight: LIST_MAX_HEIGHT },
		appearance: {
			fill: { color: colors.surfaceInput },
			blur: blur.intensity.glass,
			border: colors.glassBorder,
			rim: true,
			innerShadow: shadows.innerHighlight,
		},
		iconColor: colors.textTertiary,
	};
};

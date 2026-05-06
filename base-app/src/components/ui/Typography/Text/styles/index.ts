import { TextStyle } from "react-native";

import { ITheme } from "@/theme";

import { TEXT_VARIANT_SIZES } from "../../constants";
import { ITextVariant } from "../../types";

export const createTextStyles = (theme: ITheme, variant: ITextVariant): TextStyle => {
	const sizeKey = TEXT_VARIANT_SIZES[variant];
	const fontSize = theme.typography.sizes[sizeKey];

	return {
		fontSize,
		fontFamily: theme.typography.fontFamilies.regular,
		color: theme.colors.text,
		lineHeight: fontSize * theme.typography.lineHeights.normal,
	};
};

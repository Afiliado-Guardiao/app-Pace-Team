import { TextStyle } from "react-native";

import { ITheme } from "@/theme";

import { TITLE_LEVEL_SIZES } from "../../constants";
import { ITitleLevel } from "../../types";

export const createTitleStyles = (theme: ITheme, level: ITitleLevel): TextStyle => {
	const sizeKey = TITLE_LEVEL_SIZES[level];
	const fontSize = theme.typography.sizes[sizeKey];

	return {
		fontSize,
		fontFamily: theme.typography.fontFamilies.bold,
		color: theme.colors.text,
		lineHeight: fontSize * theme.typography.lineHeights.tight,
	};
};

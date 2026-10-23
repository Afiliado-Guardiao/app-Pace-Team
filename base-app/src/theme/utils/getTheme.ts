import { animations } from "../animations";
import { borderRadius } from "../borderRadius";
import { borderWidth } from "../borderWidth";
import { colors } from "../colors";
import { componentSizes } from "../componentSizes";
import { pace } from "../pace";
import { shadows } from "../shadows";
import { spacing } from "../spacing";
import { ITheme } from "../types";
import { typography } from "../typography";

export const getTheme = (): ITheme => ({
	colors,
	typography,
	spacing,
	shadows,
	borderRadius,
	borderWidth,
	componentSizes,
	animations,
	pace,
});

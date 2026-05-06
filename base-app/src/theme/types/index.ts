import { IAnimations } from "../animations";
import { IBorderRadius } from "../borderRadius";
import { IBorderWidth } from "../borderWidth";
import { IColors } from "../colors";
import { IComponentSizes } from "../componentSizes";
import { IShadows } from "../shadows";
import { ISpacing } from "../spacing";
import { ITypography } from "../typography";

export type { IAnimations } from "../animations";
export type { IBorderRadius } from "../borderRadius";
export type { IBorderWidth } from "../borderWidth";
export type { IColors } from "../colors";
export type { IComponentSizes } from "../componentSizes";
export type { IShadows } from "../shadows";
export type { ISpacing } from "../spacing";
export type { ITypography } from "../typography";

export interface ITheme {
	colors: IColors;
	typography: ITypography;
	spacing: ISpacing;
	shadows: IShadows;
	borderRadius: IBorderRadius;
	borderWidth: IBorderWidth;
	componentSizes: IComponentSizes;
	animations: IAnimations;
}

export interface IThemeContext {
	theme: ITheme;
}

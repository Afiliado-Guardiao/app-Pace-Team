import { IPaceBlur, paceBlur } from "./blur";
import { IPaceColors, paceColors } from "./colors";
import { IPaceGradients, paceGradients } from "./gradients";
import {
	IPaceBorders,
	IPaceLayout,
	IPaceRadii,
	IPaceSpacing,
	paceBorders,
	paceLayout,
	paceRadii,
	paceSpacing,
} from "./layout";
import { IPaceMotion, paceMotion } from "./motion";
import { IPaceShadows, paceShadows } from "./shadows";
import { IPaceTypography, paceTypography } from "./typography";

export interface IPaceTheme {
	colors: IPaceColors;
	gradients: IPaceGradients;
	typography: IPaceTypography;
	spacing: IPaceSpacing;
	radii: IPaceRadii;
	layout: IPaceLayout;
	borders: IPaceBorders;
	shadows: IPaceShadows;
	motion: IPaceMotion;
	blur: IPaceBlur;
}

// Design system PACE TEAM, acessível em theme.pace.*
export const pace: IPaceTheme = {
	colors: paceColors,
	gradients: paceGradients,
	typography: paceTypography,
	spacing: paceSpacing,
	radii: paceRadii,
	layout: paceLayout,
	borders: paceBorders,
	shadows: paceShadows,
	motion: paceMotion,
	blur: paceBlur,
};

export type { IGradientLayer, IGradientStop, IPaceGradientName } from "./gradients";
export type { IBezier } from "./motion";

import { ImageStyle } from "react-native";

import { ICON_RADIUS_RATIO, LOGO_RATIO } from "../constants";
import { ILogoVariant } from "../types";

export const createLogoStyles = (variant: ILogoVariant, height: number): { image: ImageStyle } => ({
	image: {
		height,
		width: Math.round(height * LOGO_RATIO[variant]),
		resizeMode: "contain",
		borderRadius: variant.startsWith("icon") ? Math.round(height * ICON_RADIUS_RATIO) : 0,
	},
});

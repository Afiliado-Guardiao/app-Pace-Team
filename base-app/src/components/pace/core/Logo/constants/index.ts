import { ImageSourcePropType } from "react-native";

import appIcon from "../../../../../../assets/brand/app-icon.png";
import iconMono from "../../../../../../assets/brand/icon-mono.png";
import iconOutline from "../../../../../../assets/brand/icon-outline.png";
import logoHorizontal from "../../../../../../assets/brand/logo-horizontal.png";
import logoHorizontalWhite from "../../../../../../assets/brand/logo-horizontal-white.png";
import symbol from "../../../../../../assets/brand/symbol.png";
import { ILogoVariant } from "../types";

// Logos raster extraídos do painel de identidade (sempre sobre fundo escuro).
export const LOGO_FILES: Record<ILogoVariant, ImageSourcePropType> = {
	horizontal: logoHorizontal,
	white: logoHorizontalWhite,
	symbol,
	icon: appIcon,
	iconMono,
	iconOutline,
};

// Proporção largura/altura de cada arquivo
export const LOGO_RATIO: Record<ILogoVariant, number> = {
	horizontal: 696 / 222,
	white: 696 / 216,
	symbol: 312 / 192,
	icon: 1,
	iconMono: 1,
	iconOutline: 1,
};

export const ICON_RADIUS_RATIO = 0.22;

import { ImageSourcePropType } from "react-native";

import appIcon from "../../../../../../assets/brand/app-icon.png";
import iconMono from "../../../../../../assets/brand/icon-mono.png";
import iconOutline from "../../../../../../assets/brand/icon-outline.png";
import logoHorizontal from "../../../../../../assets/brand/logo-horizontal.png";
import logoHorizontalWhite from "../../../../../../assets/brand/logo-horizontal-white.png";
import symbol from "../../../../../../assets/brand/symbol.png";
import { ILogoVariant } from "../types";

// Marca nova (2026-11-16): "PACE [Bud] TEAM" em Inter Bold creme; o símbolo
// é o Bud; o ícone é o Bud com o "buddy" e a seta. Sempre sobre fundo escuro.
export const LOGO_FILES: Record<ILogoVariant, ImageSourcePropType> = {
	horizontal: logoHorizontal,
	white: logoHorizontalWhite,
	symbol,
	icon: appIcon,
	iconMono,
	iconOutline,
};

// Proporção largura/altura do logo escrito (logo-horizontal.png: 1659 x 215)
export const WORDMARK_RATIO = 1659 / 215;

// Proporção largura/altura de cada arquivo
export const LOGO_RATIO: Record<ILogoVariant, number> = {
	horizontal: WORDMARK_RATIO,
	white: WORDMARK_RATIO,
	symbol: 312 / 192,
	icon: 1,
	iconMono: 1,
	iconOutline: 1,
};

export const ICON_RADIUS_RATIO = 0.22;

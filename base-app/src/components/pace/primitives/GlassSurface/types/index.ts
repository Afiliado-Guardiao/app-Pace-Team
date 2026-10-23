import { StyleProp, ViewStyle } from "react-native";

import { IPaceGradientName } from "@/theme";

import { ILayoutSize } from "../../../hooks";

// Preenchimento: nome de gradiente do tema ou cor sólida.
export type IGlassFill = IPaceGradientName | { color: string };

export interface IGlassAppearance {
	fill?: IGlassFill;
	// Intensidade do expo-blur (0 = sem desfoque de fundo)
	blur?: number;
	// Borda de 1px (null = sem borda, como "border: none" no CSS)
	border?: string | null;
	borderWidth?: number;
	rim?: boolean;
	outerShadow?: string;
	innerShadow?: string;
	// Raio dos cantos de baixo, quando diferente dos de cima (pódio, folha inferior)
	bottomRadius?: number;
	// Sem borda embaixo (folha que sobe da base da tela)
	openBottom?: boolean;
}

export interface IGlassSurfaceProps {
	appearance: IGlassAppearance;
	radius: number;
	style?: StyleProp<ViewStyle>;
	// Camada extra entre o preenchimento e o conteúdo (ex.: foto + scrim),
	// desenhada depois de medir a superfície
	backdrop?: (size: ILayoutSize) => React.ReactNode;
	children?: React.ReactNode;
	testID?: string;
}

export interface IGlassSurfaceStyles {
	root: ViewStyle;
	clip: ViewStyle;
	solid: ViewStyle;
	overlay: ViewStyle;
	borderWidth: number;
	bottomRadius: number;
}

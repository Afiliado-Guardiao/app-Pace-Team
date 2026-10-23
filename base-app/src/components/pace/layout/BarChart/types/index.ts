import { TextStyle, ViewStyle } from "react-native";

export interface IBarDatum {
	value: number;
	label: string;
}

export interface IBarChartProps {
	data: readonly IBarDatum[];
	// Valor que ocupa a área toda (padrão: o maior valor)
	max?: number;
	areaHeight: number;
	minHeight?: number;
	// Barra em destaque (padrão: a maior)
	highlightIndex?: number;
	radius?: number;
	idleColor?: string;
}

export interface IBarChartStyles {
	chart: ViewStyle;
	column: ViewStyle;
	bar: ViewStyle;
	barEmpty: ViewStyle;
	barHighlight: ViewStyle;
	barClip: ViewStyle;
	label: TextStyle;
}

export interface IBarColumnProps {
	datum: IBarDatum;
	index: number;
	height: number;
	isHighlight: boolean;
	styles: IBarChartStyles;
}

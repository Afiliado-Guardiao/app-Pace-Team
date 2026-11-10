import { DimensionValue } from "react-native";

// 0..1 → "42%" (largura de barras)
export const pctWidth = (ratio: number): DimensionValue =>
	`${String(Math.round(Math.max(0, Math.min(1, ratio)) * 100))}%` as DimensionValue;

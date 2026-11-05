import { SkColor } from "@shopify/react-native-skia";

// Cor do Skia a partir de r, g, b (0..255) e alfa (0..1), também nos quadros
export const rgba = (r: number, g: number, b: number, a: number): SkColor => {
	"worklet";
	return Float32Array.of(r / 255, g / 255, b / 255, a);
};

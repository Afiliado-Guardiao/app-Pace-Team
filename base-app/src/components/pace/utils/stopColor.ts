// O react-native-svg nativo (iOS/Android) ignora o alfa da cor de um <Stop>
// e só usa `stopOpacity` — um "rgba(…, .5)" virava cor sólida e cobria vídeo
// e fotos. Aqui separamos a cor (rgb) da opacidade para os dois campos.

export interface IStopColor {
	stopColor: string;
	stopOpacity: number;
}

const RGBA = /^rgba\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*\)$/i;
const HEX_ALPHA = /^#([0-9a-f]{6})([0-9a-f]{2})$/i;

export const splitStopColor = (color: string): IStopColor => {
	const rgba = RGBA.exec(color);
	if (rgba) {
		return {
			stopColor: `rgb(${rgba[1]},${rgba[2]},${rgba[3]})`,
			stopOpacity: Number(rgba[4]),
		};
	}
	const hex = HEX_ALPHA.exec(color);
	if (hex) {
		return { stopColor: `#${hex[1]}`, stopOpacity: parseInt(hex[2], 16) / 255 };
	}
	return { stopColor: color, stopOpacity: 1 };
};

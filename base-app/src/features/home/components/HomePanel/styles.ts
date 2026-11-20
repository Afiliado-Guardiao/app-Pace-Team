import { ImageStyle, Platform, ViewStyle } from "react-native";

import { ACRYLIC, PANEL } from "./constants";

interface IPanelSize {
	width: number;
	height: number;
}

// Na web, "hidden" ainda deixa o navegador rolar o card ao focar uma bolinha
// (a foto e as bolinhas das pontas passam da borda); "clip" não rola
const CLIP = (Platform.OS === "web" ? "clip" : "hidden") as "hidden";

// Altura da área das seções para a largura do card (proporção 360 × 379)
export const sectionHeightOf = (width: number): number =>
	(width * PANEL.sectionHeight) / PANEL.baseWidth;

export const createHomePanelStyles = ({ width, height }: IPanelSize) => {
	const sectionH = sectionHeightOf(width);
	const fullH = PANEL.bubblesHeight + sectionH;
	const fill = { position: "absolute", left: 0, top: 0, right: 0, bottom: 0 } as ViewStyle;
	return {
		card: {
			marginTop: 14,
			height: PANEL.bubblesHeight + sectionH,
			borderRadius: PANEL.radius,
			boxShadow: ACRYLIC.shadow,
			backgroundColor: ACRYLIC.base,
		} as ViewStyle,
		clip: { ...fill, borderRadius: PANEL.radius, overflow: CLIP } as ViewStyle,
		// Borda por cima (a área interna tem a largura toda do card)
		rim: {
			...fill,
			borderRadius: PANEL.radius,
			borderWidth: 1,
			borderColor: ACRYLIC.border,
		} as ViewStyle,
		acrylic: { ...fill, backgroundColor: ACRYLIC.base } as ViewStyle,
		photo: {
			position: "absolute",
			left: -PANEL.photoBleed,
			top: -PANEL.photoBleed,
			width: width + PANEL.photoBleed * 2,
			height: height + PANEL.photoBleed * 2,
		} as ImageStyle,
		// brightness(.8): a foto escurece um pouco
		dim: { ...fill, backgroundColor: "rgba(0,0,0,.2)" } as ViewStyle,
		layer: { position: "absolute", left: 0, top: 0 } as ViewStyle,
		// As seções ocupam o card todo (o Ranking passa por baixo das bolinhas);
		// as outras começam abaixo da fileira de bolinhas (inner)
		sections: {
			position: "absolute",
			left: 0,
			top: 0,
			width,
			height: fullH,
			overflow: CLIP,
		} as ViewStyle,
		track: { position: "absolute", left: 0, top: 0, width, height: fullH } as ViewStyle,
		inner: { marginTop: PANEL.bubblesHeight, height: sectionH } as ViewStyle,
		slot: (i: number): ViewStyle => ({
			position: "absolute",
			left: i * width,
			top: 0,
			width,
			height: fullH,
		}),
	};
};

import { IGradientLayer } from "@/theme";

export interface IGradientLayersProps {
	layers: readonly IGradientLayer[];
	width: number;
	height: number;
}

export interface IGradientLayerProps {
	layer: IGradientLayer;
	id: string;
	width: number;
	height: number;
}

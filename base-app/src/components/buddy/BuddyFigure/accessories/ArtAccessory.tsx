import React from "react";
import { Image } from "react-native";

import { IStudioArt } from "./studioArt";

interface IArtAccessoryProps {
	art: IStudioArt;
}

// Acessório 3D do Buddy Studio: a imagem recortada no lugar certo do corpo
export const ArtAccessory: React.FC<IArtAccessoryProps> = ({ art }) => (
	<Image
		source={art.source}
		resizeMode={art.isStretch ? "stretch" : "contain"}
		style={{
			position: "absolute",
			left: art.left,
			top: art.top,
			width: art.width,
			height: art.width * art.ratio,
		}}
	/>
);

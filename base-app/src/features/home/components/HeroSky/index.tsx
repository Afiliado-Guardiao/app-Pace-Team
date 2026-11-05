import React from "react";
import { View } from "react-native";

import { Canvas, Picture } from "@shopify/react-native-skia";

import { IWeekHero } from "../../hooks/useWeekHero";
import { useSkyPicture } from "../WeekHero/hooks/useSkyPicture";

import { createHeroSkyStyles } from "./styles";

interface IHeroSkyProps {
	hero: IWeekHero;
}

// Céu do Início (sol / estrelas), atrás de todo o conteúdo, de borda a borda
export const HeroSky: React.FC<IHeroSkyProps> = ({ hero }) => {
	const { frame, backdropTop } = hero.layout;
	const picture = useSkyPicture({ frame, weather: hero.weather.weather, clocks: hero.clocks });
	const styles = createHeroSkyStyles({
		top: -backdropTop,
		width: frame.width,
		height: frame.height,
	});

	return (
		<View style={styles.layer} pointerEvents="none">
			<Canvas style={styles.canvas}>
				<Picture picture={picture} />
			</Canvas>
		</View>
	);
};

import React from "react";
import { Image } from "react-native";

import { LOGO_FILES } from "./constants";
import { createLogoStyles } from "./styles";
import { ILogoProps } from "./types";

const DEFAULT_HEIGHT = 40;

// Logo PACE TEAM (nunca redesenhar; sempre sobre fundo escuro).
export const Logo: React.FC<ILogoProps> = ({
	variant = "horizontal",
	height = DEFAULT_HEIGHT,
	style,
}) => {
	const styles = createLogoStyles(variant, height);

	return (
		<Image
			source={LOGO_FILES[variant]}
			style={[styles.image, style]}
			accessibilityRole="image"
			accessibilityLabel="PACE TEAM"
		/>
	);
};

export * from "./types";

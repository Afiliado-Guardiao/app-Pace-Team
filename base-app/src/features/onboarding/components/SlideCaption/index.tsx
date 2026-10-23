import React from "react";
import { Text } from "react-native";

import Animated from "react-native-reanimated";

import { Highlight, useEntrance } from "@/components/pace";

import { IOnboardingSlide } from "../../constants";

interface ISlideCaptionProps {
	slide: IOnboardingSlide;
	styles: { caption: object; title: object; text: object };
}

// Título em duas linhas com a palavra-chave em destaque + texto; sobe a cada troca.
export const SlideCaption: React.FC<ISlideCaptionProps> = ({ slide, styles }) => {
	const entrance = useEntrance("rise", { duration: 500 });

	return (
		<Animated.View style={[styles.caption, entrance]}>
			<Text style={styles.title} accessibilityRole="header">
				{slide.lineA}
				{"\n"}
				<Highlight>{slide.lineB}</Highlight>
			</Text>
			<Text style={styles.text}>{slide.text}</Text>
		</Animated.View>
	);
};

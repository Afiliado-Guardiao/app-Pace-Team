import { ImageStyle, TextStyle, ViewStyle } from "react-native";

import { ITheme } from "@/theme";

// Proporção da arte (843 × 1182, igual às fotos do feed)
export const POST_ART_RATIO = 843 / 1182;

// Medidas em "cqw" do design: 1 unidade = 1% da largura da arte
export const createPostArtStyles = (theme: ITheme, cqw: number) => {
	const { colors, typography } = theme.pace;
	const shadow = {
		textShadowColor: colors.textShadow,
		textShadowOffset: { width: 0, height: 1 },
		textShadowRadius: 6,
	};

	return {
		root: {
			width: "100%",
			aspectRatio: POST_ART_RATIO,
			overflow: "hidden",
			backgroundColor: colors.bgApp,
		} as ViewStyle,
		overlayOnly: { backgroundColor: colors.transparent } as ViewStyle,
		fill: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0 } as ViewStyle,
		image: { position: "absolute", top: 0, left: 0, width: "100%", height: "100%" } as ImageStyle,
		stats: { position: "absolute", left: "5.4%", top: "3.6%" } as ViewStyle,
		label: {
			...shadow,
			fontFamily: typography.fonts.semibold,
			fontSize: 3.3 * cqw,
			color: colors.ink.white,
		} as TextStyle,
		value: {
			...shadow,
			textShadowRadius: 10,
			marginTop: 0.6 * cqw,
			marginBottom: 3.2 * cqw,
			fontFamily: typography.fonts.bold,
			fontSize: 5.6 * cqw,
			lineHeight: 5.6 * cqw * 1.05,
			letterSpacing: -0.01 * 5.6 * cqw,
			color: colors.ink.white,
		} as TextStyle,
		lastValue: { marginBottom: 0 } as TextStyle,
		logo: { position: "absolute", left: "33%", bottom: "4.4%", width: "34%" } as ViewStyle,
	};
};

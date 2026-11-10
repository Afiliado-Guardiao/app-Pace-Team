import React from "react";
import { Image, Text, View } from "react-native";

import Animated, { FadeIn, ZoomIn } from "react-native-reanimated";

import { ITheme, useTheme } from "@/theme";

import { IShowcaseScene } from "../../constants";
import { BuddyScene } from "../BuddyScene";

interface IShowcasePhoneProps {
	scene: IShowcaseScene;
}

const SCREEN = { w: 214, h: 463 } as const;
const BEZEL = 7;
const COIN = 62;

const createShowcasePhoneStyles = (theme: ITheme) => {
	const { colors, typography } = theme.pace;
	const fill = { position: "absolute" as const, top: 0, left: 0, right: 0, bottom: 0 };
	return {
		frame: {
			padding: BEZEL,
			borderRadius: 38,
			backgroundColor: colors.slate[700],
			borderWidth: 1,
			borderColor: colors.glassBorderStrong,
			boxShadow: "0 30px 60px -20px rgba(0,0,0,.7)",
		},
		screen: {
			width: SCREEN.w,
			height: SCREEN.h,
			borderRadius: 31,
			overflow: "hidden" as const,
			backgroundColor: colors.bgApp,
		},
		fill,
		island: {
			position: "absolute" as const,
			top: 8,
			left: (SCREEN.w - 64) / 2,
			width: 64,
			height: 18,
			borderRadius: 9,
			backgroundColor: colors.bgSunken,
		},
		badge: {
			position: "absolute" as const,
			left: 18,
			right: 18,
			top: SCREEN.h / 2 - 80,
			alignItems: "center" as const,
			gap: 4,
			padding: 12,
			borderRadius: 20,
			backgroundColor: colors.glassPanel,
			borderWidth: 1,
			borderColor: colors.glassBorder,
		},
		coin: { width: COIN, height: COIN },
		label: { fontFamily: typography.fonts.extrabold, fontSize: 9, letterSpacing: 1.3 },
		title: {
			fontFamily: typography.fonts.extrabold,
			fontSize: 13,
			color: colors.textPrimary,
			textAlign: "center" as const,
		},
		tones: { gold: colors.semantic.gold, green: colors.statusSuccess },
	};
};

// Celular de vitrine (moldura titânio + ilha) com a tela real de cada cena
export const ShowcasePhone: React.FC<IShowcasePhoneProps> = ({ scene }) => {
	const { theme } = useTheme();
	const styles = createShowcasePhoneStyles(theme);

	return (
		<View style={styles.frame}>
			<View style={styles.screen}>
				<Animated.View entering={FadeIn.duration(350)} key={scene.id} style={styles.fill}>
					{scene.image ? (
						<Image source={scene.image} style={styles.fill} resizeMode="cover" />
					) : (
						<BuddyScene />
					)}
					{scene.badge ? (
						<Animated.View entering={ZoomIn.delay(350).springify()} style={styles.badge}>
							<Image source={scene.badge.art} style={styles.coin} resizeMode="contain" />
							<Text style={[styles.label, { color: styles.tones[scene.badge.tone] }]}>
								{scene.badge.label}
							</Text>
							<Text style={styles.title}>{scene.badge.title}</Text>
						</Animated.View>
					) : null}
				</Animated.View>
				<View style={styles.island} />
			</View>
		</View>
	);
};

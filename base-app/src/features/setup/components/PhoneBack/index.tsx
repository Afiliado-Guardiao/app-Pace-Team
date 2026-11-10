import React from "react";
import { Image, Text, View } from "react-native";

import Animated from "react-native-reanimated";

import { ITheme, useTheme } from "@/theme";

import symbol from "../../../../../assets/brand/symbol.png";
import { useTapWaves } from "../../hooks/useTapWaves";

interface IPhoneBackProps {
	// Muda a cada 3,4 s: as ondas dos 2 toques recomeçam
	beat: number;
}

const PHONE = { w: 118, h: 206 } as const;
const CAM = 46;
const LENS = 15;
const WAVE = 90;

const createPhoneBackStyles = (theme: ITheme) => {
	const { colors, typography, radii } = theme.pace;
	return {
		phone: {
			width: PHONE.w,
			height: PHONE.h,
			borderRadius: 26,
			borderWidth: 1.5,
			borderColor: colors.glassBorderStrong,
			backgroundColor: colors.glass2,
			alignItems: "center" as const,
			justifyContent: "center" as const,
			gap: 10,
		},
		cam: {
			position: "absolute" as const,
			top: 12,
			left: 12,
			width: CAM,
			height: CAM,
			borderRadius: 14,
			backgroundColor: colors.glass3,
			flexDirection: "row" as const,
			flexWrap: "wrap" as const,
			padding: 5,
			gap: 4,
		},
		lens: { width: LENS, height: LENS, borderRadius: LENS / 2, backgroundColor: colors.bgSunken },
		symbol: { width: 44, height: 27 },
		wave: {
			position: "absolute" as const,
			width: WAVE,
			height: WAVE,
			borderRadius: WAVE / 2,
			borderWidth: 2,
			borderColor: colors.accent,
		},
		badge: {
			paddingHorizontal: 10,
			paddingVertical: 3,
			borderRadius: radii.pill,
			backgroundColor: colors.accent,
		},
		badgeText: { fontFamily: typography.fonts.extrabold, fontSize: 12, color: colors.onAccent },
	};
};

// Traseira do celular (câmeras + símbolo PACE) com as ondas dos 2 toques
export const PhoneBack: React.FC<IPhoneBackProps> = ({ beat }) => {
	const { theme } = useTheme();
	const styles = createPhoneBackStyles(theme);
	const waves = useTapWaves(beat);

	return (
		<View style={styles.phone}>
			<View style={styles.cam}>
				<View style={styles.lens} />
				<View style={styles.lens} />
				<View style={styles.lens} />
			</View>
			<Animated.View style={[styles.wave, waves.first]} pointerEvents="none" />
			<Animated.View style={[styles.wave, waves.second]} pointerEvents="none" />
			<Image source={symbol} style={styles.symbol} resizeMode="contain" />
			<View style={styles.badge}>
				<Text style={styles.badgeText}>2×</Text>
			</View>
		</View>
	);
};
